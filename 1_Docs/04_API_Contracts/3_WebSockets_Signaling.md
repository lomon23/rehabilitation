# API Contracts: WebRTC Signaling (WebSockets)

**Статус:** Draft
**Базовий URL:** `ws://[domain]/ws/signaling/{room_pin}/`

## Концепція
Клієнти підключаються до кімнати за умовним 4-значним PIN-кодом. Після з'єднання вони обмінюються SDP-офферами та ICE-кандидатами для встановлення прямого P2P-з'єднання. Сервер працює як тупий ретранслятор: отримує повідомлення від одного клієнта і пересилає іншому.

---
## 1. Відправка SDP Offer / Answer
Коли клієнт ініціює з'єднання або відповідає на нього.

**Payload:**
```json
{
  "type": "sdp",
  "payload": {
    "sdp_type": "offer", // або "answer"
    "sdp": "v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1..."
  }
}
````

---
## 2. Відправка ICE Candidate

Коли STUN-сервер повертає публічну IP-адресу клієнта.

**Payload:**
```JSON
{
  "type": "ice_candidate",
  "payload": {
    "candidate": "candidate:842163049 1 udp 1677729535 82.112.x.x...",
    "sdpMid": "0",
    "sdpMLineIndex": 0
  }
}
```

---
## 3. Системні повідомлення від Сервера

Сервер сповіщає про стан кімнати.

**Payload:**
```JSON
{
  "type": "system",
  "message": "peer_joined" // Варіанти: "peer_joined", "peer_disconnected", "room_full"
}
```

































