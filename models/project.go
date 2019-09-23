package models

type Project struct {
	Id      int    `json:"id" gorm:"PRIMARY_KEY"`
	Name    string `json:"name"`
	GenPath string `json:"gen_path"`
}
