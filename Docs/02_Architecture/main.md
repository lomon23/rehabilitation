
app [metrix, ai, calendar, sockets, camera, system_skype]

user1 - коприсувач
user2 - реабілітолог

metrix -> json
uiser1-> camera -> ai-> metrix -> json -> system_skype -> user 2
user 2 -> report -> json -> system_skype -> user1

user2 -> user 2 -> report -> json

system_skype(user2) -> have(invite_code)  -> host_server
system_skype(user1) -> input(invite_code) -> connection_to_user2

