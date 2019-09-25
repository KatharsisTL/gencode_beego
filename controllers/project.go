package controllers

import (
	"github.com/KatharsisTL/gencode_beego/models"
	"github.com/astaxie/beego/logs"
	"strconv"
)

type ProjectController struct {
	BaseController
}

func (c *ProjectController) Select() {
	if c.Ctx.Input.Param(":ext") == "json" {
		res := make([]models.Project, 0)
		Db.Order("id desc").Find(&res)
		c.Data["json"] = res
		c.ServeJSON()
	}
}

func (c *ProjectController) One() {
	if c.Ctx.Input.Param(":ext") == "json" {
		obj := models.Project{}
		s_id := c.Ctx.Input.Param(":id")
		if id, err := strconv.Atoi(s_id); err != nil {
			logs.Error(err.Error())
		} else {
			db := c.GetDb()
			defer db.Close()
			db.First(&obj, id)
		}
		c.Data["json"] = obj
		c.ServeJSON()
	}
}

func (c *ProjectController) Save() {
	r := BoolResult{Result: false, Error: "Initial state"}
	obj := models.Project{}
	c.ReadInputObj(&obj)
	if obj.Name == "" || obj.GenPath == "" {
		r.Result = false
		r.Error = "Не введено имя или папка для генерации проекта"
	} else {
		if obj.Id == 0 {
			c.Create(&obj, &r)
		} else {
			c.Update(&obj, &r)
		}
	}
	c.Data["json"] = r
	c.ServeJSON()
}

func (c *ProjectController) Create(obj *models.Project, res *BoolResult) {
	checkObj := models.Project{}
	db := c.GetDb()
	defer db.Close()
	db.Where("name = ?", obj.Name).First(&checkObj)
	if checkObj.Id > 0 {
		res.Result = false
		res.Error = "Такая запись уже есть"
	} else {
		tr := db.Begin()
		defer tr.Close()
		if err :=  tr.Create(&obj).Error; err != nil {
			tr.Rollback()
			res.Result = false
			res.Error = err.Error()
		} else {
			tr.Commit()
			res.Result = true
			res.Error = "Запись успешно добавлена"
			res.Ext = obj.Id
		}
	}
}

func (c *ProjectController) Update(obj *models.Project, res *BoolResult) {
	checkObj := models.Project{}
	db := c.GetDb()
	defer db.Close()
	db.Where("name = ? and id <> ?", obj.Name, obj.Id).First(&checkObj)
	if checkObj.Id > 0 {
		res.Result = false
		res.Error = "Такая запись уже есть"
	} else {
		tr := db.Begin()
		defer tr.Close()
		if err := tr.Save(&obj).Error; err != nil {
			tr.Rollback()
			res.Result = false
			res.Error = err.Error()
		} else {
			tr.Commit()
			res.Result = true
			res.Error = "Запись успешно изменена"
			res.Ext = obj.Id
		}
	}
}

func (c *ProjectController) Delete() {
	r := BoolResult{Result: false, Error: "Initial state"}
	s_id := c.Ctx.Input.Param(":id")
	if id, err := strconv.Atoi(s_id); err != nil {
		r.Result = false
		r.Error = err.Error()
	} else {
		db := c.GetDb()
		defer db.Close()
		obj := models.Project{}
		db.Where("id = ?", id).First(&obj)
		//Удаление
		if obj.Id > 0 {
			//Проверяем, есть ли сущности
			cnt := 0
			if err := db.Raw("select count(id) from entities where project_id = ?", obj.Id).Row().Scan(&cnt); err != nil {
				r.Result = false
				r.Error = err.Error()
			} else {
				if cnt > 0 {
					r.Result = false
					r.Error = "Сначала необходимо удалить все дочерние сущности"
				} else {
					tr := db.Begin()
					defer tr.Close()
					if err := tr.Delete(&obj).Error; err != nil {
						tr.Rollback()
						r.Result = false
						r.Error = err.Error()
						r.Ext = obj.Id
					} else {
						tr.Commit()
						r.Result = true
						r.Error = "Удаление успешно завершено"
					}
				}
			}
		} else {
			r.Result = false
			r.Error = "Нет записей для удаления"
		}
	}
	c.Data["json"] = r
	c.ServeJSON()
}