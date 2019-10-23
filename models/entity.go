package models

type Entity struct {
	Id        int     `json:"id" gorm:"PRIMARY_KEY"`
	ProjectId int     `json:"project_id"`
	Project   Project `json:"project"`
	Name      string  `json:"name"`
	Label     string  `json:"label"`
	Descr     string  `json:"descr"`
}

func (*Entity) TableName() string {
	return "entities"
}
