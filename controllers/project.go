package controllers

import "github.com/KatharsisTL/gencode_beego/models"

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