package controllers

import (
	"github.com/KatharsisTL/gencode_beego/models"
	"github.com/astaxie/beego/logs"
	"strconv"
)

type EntityController struct {
	BaseController
}

func (c *EntityController) Select() {
	if c.Ctx.Input.Param(":ext") == "json" {
		res := make([]models.Entity, 0)
		sProjectId := c.GetString("project_id")
		if projectId, err := strconv.Atoi(sProjectId); err != nil {
			Db.Order("id desc").Find(&res)
		} else {
			Db.Order("id desc").Find(&res, "project_id = ?", projectId)
		}
		c.Data["json"] = res
		c.ServeJSON()
	}
}

func (c *EntityController) One() {
	if c.Ctx.Input.Param(":ext") == "json" {
		obj := models.Entity{}
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

func (c *EntityController) Save() {
	r := BoolResult{Result: false, Error: "Initial state"}
	obj := models.Entity{}
	c.ReadInputObj(&obj)
	if obj.Id == 0 {
		c.Create(&obj, &r)
	} else {
		c.Update(&obj, &r)
	}
	c.Data["json"] = r
	c.ServeJSON()
}

func (c *EntityController) Create(obj *models.Entity, res *BoolResult) {
	checkObj := models.Entity{}
	db := c.GetDb()
	defer db.Close()
	db.Where("name = ? and project_id = ?", obj.Name, obj.ProjectId).First(&checkObj)
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

func (c *EntityController) Update(obj *models.Entity, res *BoolResult) {
	checkObj := models.Entity{}
	db := c.GetDb()
	defer db.Close()
	db.Where("name = ? and project_id = ? and id <> ?", obj.Name, obj.ProjectId, obj.Id).First(&checkObj)
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

func (c *EntityController) Delete() {
	r := BoolResult{Result: false, Error: "Initial state"}
	s_id := c.Ctx.Input.Param(":id")
	if id, err := strconv.Atoi(s_id); err != nil {
		r.Result = false
		r.Error = err.Error()
	} else {
		db := c.GetDb()
		defer db.Close()
		obj := models.Entity{}
		db.Where("id = ?", id).First(&obj)
		//Удаление
		if obj.Id > 0 {
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
		} else {
			r.Result = false
			r.Error = "Нет записей для удаления"
		}
	}
	c.Data["json"] = r
	c.ServeJSON()
}