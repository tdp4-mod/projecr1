const fetch =require('node-fetch');
const express = require('express');

exports.brad = async function  (PROMPT) {
    let output = {};

    try {
    const BARD_URL =
  "https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate";
  const Secure1PSID = "XAg2FpnFDR940bGfXcGkHqeM6FpdrALxg17UWJEu8KrE2meScJaF45EeAQV-tU_kwhBQhg.";
  const AT_KEY = "AFuTz6ueKRJzwpz6RXO1AwN1j99W:1685780331985";
            console.log(PROMPT)
  const messageRequest = [[PROMPT], null, ["", "", ""]];
const urlencoded = new URLSearchParams();
urlencoded.append("at", AT_KEY);
urlencoded.append(
  "f.req",
  JSON.stringify([null, JSON.stringify(messageRequest)])
);
        
const params = new URLSearchParams({
  bl: "boq_assistant-bard-web-server_20230419.00_p1",
  _reqid: Number(Math.random().toString().slice(2, 8)),
  rt: "c",
});
        
   const headers = new fetch.Headers();
headers.append("X-Same-Domain", "1");
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
);
headers.append(
  "Content-Type",
  "application/x-www-form-urlencoded;charset=UTF-8"
);
headers.append("Sec-Fetch-Site", "same-origin");
headers.append("Sec-Fetch-Mode", "cors");
headers.append("Sec-Fetch-Dest", "empty");
headers.append("Cookie", `__Secure-1PSID=${Secure1PSID};`);
        
const requestOptions = {
  method: "POST",
  headers: headers,
  body: urlencoded,
  redirect: "follow",
};
  

const request = await fetch(`${BARD_URL}?${params}`, requestOptions);
        
const response = await request.text();
console.log(response)
const output = JSON.parse(response.split(/\r?\n/)[3])[0][2];
const content = JSON.parse(output)[0][0];

        output.STATUS = true;
        output.text = content
        console.log(output);
        return output;
    } catch (error) {
        console.log(error);
        output.STATUS = false;
        output.err = error
        return output;
    }
};