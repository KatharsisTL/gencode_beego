package routers

import (
	"github.com/KatharsisTL/gencode_beego/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/template", &controllers.MainController{}, "get:Template")

    beego.Router("/project/select", &controllers.ProjectController{}, "get:Select")
}
