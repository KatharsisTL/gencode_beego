package models

type Project struct {
	Id         int    `json:"id" gorm:"PRIMARY_KEY"`
	Name       string `json:"name"`
	ShortTitle string `json:"short_title"`
	Title      string `json:"title"`
	GenPath    string `json:"gen_path"`
}
