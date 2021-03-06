package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/jinzhu/gorm"
	"log"
)

var Db *gorm.DB

type BaseController struct {
	beego.Controller
}

type BoolResult struct {
	Result bool        `json:"result"`
	Error  string      `json:"error"`
	Ext    interface{} `json:"ext"`
}

//Возвращает объект БД
func GetDb() *gorm.DB {
	db, err := gorm.Open(beego.AppConfig.String("dbDriverName"), beego.AppConfig.String("dbConnectionString"))
	if err != nil {
		log.Println(err.Error())
	}
	return db
}

//Возвращает объект БД в контроллере
func (c *BaseController) GetDb() *gorm.DB {
	return GetDb()
}

func (c *BaseController) ReadInputObj(iFace interface{}) {
	json.Unmarshal([]byte(c.GetString("data")), &iFace)
}
