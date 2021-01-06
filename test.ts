rtc.getDevice();
rtc.setClockData(clockData.year, 2021)
rtc.setClockData(clockData.month, 1)
rtc.setClockData(clockData.day, 7)
rtc.setClockData(clockData.hour, 4)
rtc.setClockData(clockData.minute, 32)
rtc.setClockData(clockData.second, 16)
basic.showNumber(rtc.getClockData(clockData.year));
basic.pause(1000)
rtc.setClock();
basic.showNumber(rtc.getClockData(clockData.year));
basic.pause(1000)
basic.showNumber(rtc.getDevice());
basic.pause(1000)
basic.forever(function () {
    rtc.getClock();
    basic.showNumber(rtc.getClockData(clockData.second) % 10);
    basic.pause(100)
})