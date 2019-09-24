package routers

import (
	"github.com/KatharsisTL/gencode_beego/controllers"
	"github.com/astaxie/beego"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/template", &controllers.MainController{}, "get:Template")

    //Пока что неясно, какую таблицу буду использовать для отображения всех данных
	//beego.Router("/project/all", &controllers.ProjectController{}, "post:All")
    beego.Router("/project/select", &controllers.ProjectController{}, "get:Select")
	beego.Router("/project/:id/one", &controllers.ProjectController{}, "get:One")
	beego.Router("/project/save", &controllers.ProjectController{}, "post:Save")
	beego.Router("/project/:id/delete", &controllers.ProjectController{}, "post:Delete")

	beego.Router("/entity/select", &controllers.EntityController{}, "get:Select")
	beego.Router("/entity/:id/one", &controllers.EntityController{}, "get:One")
	beego.Router("/entity/save", &controllers.EntityController{}, "post:Save")
	beego.Router("/entity/:id/delete", &controllers.EntityController{}, "post:Delete")
}
