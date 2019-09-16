package main

import (
	"github.com/KatharsisTL/gencode_beego/controllers"
	_ "github.com/KatharsisTL/gencode_beego/routers"
	"github.com/astaxie/beego"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	beego.BConfig.WebConfig.TemplateLeft = "<<"
	beego.BConfig.WebConfig.TemplateRight = ">>"

	beego.BConfig.WebConfig.Session.SessionGCMaxLifetime = 604800
	beego.BConfig.WebConfig.Session.SessionCookieLifeTime = int(604800)

	controllers.Db = controllers.GetDb()

	beego.Run()
}

