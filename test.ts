for(let dev=0;dev<7;dev++){
    rtc.setDevice(dev)
    rtc.getClock()
    basic.showString(convertToText(dev) + ":" + rtc.getClockData(0) + "," + rtc.getClockData(1) + "," + rtc.getClockData(2) + "," + rtc.getClockData(3) + "," + rtc.getClockData(4) + "," + rtc.getClockData(5) + "," + rtc.getClockData(5));
    basic.pause(1000)
}