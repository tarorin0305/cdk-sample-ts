package main

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/labstack/gommon/log"
)

type SlackRequestBody struct {
	Channel   string  `json:"channel"`
	Username  string  `json:"username"`
	Text      string  `json:"text"`
	IconEmoji *string `json:"icon_emoji,omitempty"`
}

func ReportToSlack(webHookUrl string, reqBody SlackRequestBody) error {
	jsonAsByte, _ := json.Marshal(reqBody)
	req, err := http.NewRequest(
		"POST",
		webHookUrl,
		bytes.NewReader(jsonAsByte),
	)

	if err != nil {
		log.Error(err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Error(err)
		return err
	}

	defer resp.Body.Close()

	return nil
}
