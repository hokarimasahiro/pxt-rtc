let buf=[0,0,0,0,0,0,0];
for(let dev=0;dev<7;dev++){
    rtc.setDevice(dev)
    buf=rtc.getClock()
    basic.showString(convertToText(dev) + ":" + convertToText(buf[0]) + "," + convertToText(buf[1]) + "," + convertToText(buf[2]) + "," + convertToText(buf[3]) + "," + convertToText(buf[4]) + "," + convertToText(buf[5]) + "," + convertToText(buf[6]));
    basic.pause(1000)
}