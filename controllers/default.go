package controllers

import (
	"github.com/astaxie/beego/logs"
	"time"
)

type MainController struct {
	BaseController
}

func (c *MainController) Get() {
	c.Data["appTitle"] = "Gencode"
	dt := time.Now().Format("20060102150405")
	c.Data["css"] = "static/css/app.css?d=" + dt
	c.Data["js"] = "static/js/main1.js?d=" + dt
	c.TplName = "index.html"
}

func (c *MainController) Template() {
	tplName := c.GetString("tpl_name")
	println(tplName)
	if tplName != "" {
		c.TplName = tplName + ".html"
	} else {
		logs.Error("tpl_name is empty")
	}
}