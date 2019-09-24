package models

type Entity struct {
	Id        int     `json:"id" gorm:"PRIMARY_KEY"`
	ProjectId int     `json:"project_id"`
	Project   Project `json:"project"`
	Name      string  `json:"name"`
}

func (*Entity) TableName() string {
	return "entities"
}
