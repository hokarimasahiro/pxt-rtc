/**
 * makecode RTC Package.
 */
enum rtcType {
    // % block="DS3231"
    ds3231 = 0,
    // % block="MCP79410"
    mcp79410 = 1,
    // % block="RX8035"
    rx8035 = 2,
    // % block="PCF2129"
    pcf2129 = 3,
    // % block="PCF8523"
    pcf8523 = 4,
    // % block="PCF85063"
    pcf85063 = 5,
    // % block="DS1307"
    ds1307 = 6,
    // % block="NON"
    NON = -1
}
enum clockData {
    // % block="年"
    year = 0,
    // % block="月"
    month = 1,
    // % block="日"
    day = 2,
    // % block="曜日"
    weekday = 3,
    // % block="時"
    hour = 4,
    // % block="分"
    minute = 5,
    // % block="秒"
    second = 6
}

/**
 * RTC block
 */
//% weight=10 color=#800080 icon="\uf017" block="RTC"
namespace rtc {

    let deviceType = 0;   // DS3231
    let I2C_ADDR = 0x68
    let REG_CTRL = 0x0e
    let REG_SECOND = 0x0
    let weekStart = 1   // 0:0-6 1:1-7
    let REG_SEQ = 0     // 0:SECOND,MINUTE,HOUR,WEEKDAY,DAY,MONTH,YEAR  1:0:SECOND,MINUTE,HOUR,DAY,WEEKDAY,MONTH,YEAR
    /**
     * set reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    /**
     * get reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert a BCD data to Dec
     */
    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat & 0x0f);
    }

    /**
     * convert a Dec data to BCD
     */
    function DecToHex(dat: number): number {
        return Math.trunc(dat / 10) << 4 | (dat % 10)
    }

    /**
     * get device
     */
    //% blockId="getDevice" block="get device"    //% weight=80 blockGap=8
    //% advanced=true
    export function getDevice(): number {
        return deviceType;
    }
    /**
     * set device
     * @param devType device type, eg:rtcType.ds3231
     */
    //% blockId="setDevice" block="set device %devType"
    //% advanced=true
    export function setDevice(devType: rtcType): void {

        deviceType = devType;

        switch (deviceType) {
            case rtcType.ds3231:
                I2C_ADDR = 0x68; REG_CTRL = 0x0e; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                break;
            case rtcType.mcp79410:
                I2C_ADDR = 0x6f; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                setReg(REG_SECOND, getReg(REG_SECOND) || 0x80)
                break;
            case rtcType.rx8035:
                I2C_ADDR = 0x32; REG_CTRL = 0x0f; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 0;
                break;
            case rtcType.pcf2129:
                I2C_ADDR = 0x51; REG_CTRL = 0x00; REG_SECOND = 0x03; REG_SEQ = 1; weekStart = 0;
                break;
            case rtcType.pcf8523:
                I2C_ADDR = 0x58; REG_CTRL = 0x00; REG_SECOND = 0x03; REG_SEQ = 1; weekStart = 0;
                break;
            case rtcType.pcf85063:
                I2C_ADDR = 0x51; REG_CTRL = 0x00; REG_SECOND = 0x04; REG_SEQ = 1; weekStart = 0;
                break;
            case rtcType.ds1307:
                I2C_ADDR = 0x68; REG_CTRL = 0x07; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                break;
            default: // DS3231
                I2C_ADDR = 0x68; REG_CTRL = 0x0e; REG_SECOND = 0x00; REG_SEQ = 0; weekStart = 1;
                break;
        }

//        if (testi2c.testReadI2c(I2C_ADDR) != 0) return -1;

        switch (deviceType) {
            case rtcType.ds1307:
                break;
            case rtcType.ds3231:
                setReg(REG_CTRL, 0x1c)
                break;
            case rtcType.pcf2129:
                setReg(REG_CTRL, 0x08)
                break;
            case rtcType.pcf8523:
                break;
            case rtcType.pcf85063:
                break;
            case rtcType.mcp79410:
                break;
            case rtcType.rx8035:
                break;
            default:
                break;
        }
//        return (testi2c.testReadI2c(I2C_ADDR));
    }
    /**
     * set clock array
     * @param tm array of time data
     */
    //% blockId="setClockArray" block="set clock %timeArray"
    //% advanced=true
    export function setClockArray(tm: number[]): void {
        setClock(tm[0], tm[1], tm[2], tm[3], tm[4], tm[5], tm[6]);
    }

    /**
     * set clock
     * @param year data of year, eg: 2019
     * @param month data of month, eg: 3
     * @param day data of day, eg: 14
     * @param weekday data of weekday, eg: 4
     * @param hour data of hour, eg: 5
     * @param minute data of minute, eg: 30
     * @param second data of second, eg: 0
     */
    //% blockId="setClock" block="set clock data|year %year|month %month|day %day|weekday %weekday|hour %hour|minute %minute|second %second"
    //% advanced=true
    export function setClock(year: number, month: number, day: number, weekday: number, hour: number, minute: number, second: number): void {

        let buf = pins.createBuffer(8);

        buf[0] = REG_SECOND;
        buf[1] = DecToHex(second);
        buf[2] = DecToHex(minute);
        buf[3] = DecToHex(hour);
        if (REG_SEQ == 0) {
            buf[4] = DecToHex(weekday + weekStart);
            buf[5] = DecToHex(day);
        } else {
            buf[4] = DecToHex(day);
            buf[5] = DecToHex(weekday + weekStart);
        }
        buf[6] = DecToHex(month);
        buf[7] = DecToHex(year % 100);
        if (deviceType == rtcType.rx8035) {
            buf[0] = REG_SECOND << 4 | 0;
            buf[3] = buf[3] | 0x80;   // 24H bit
        }
        if (deviceType == rtcType.mcp79410) {
            buf[1] = buf[1] | 0x80;       // Start Clock
            buf[4] = buf[4] | 0x08;     // Vbat Enable
        }

        pins.i2cWriteBuffer(I2C_ADDR, buf)
    }
    /**
     * get clock
     */
    //% blockId="getClock" block="get clock"
    //% advanced=true
    export function getClock(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0];
        let offset: number;

        if (deviceType == rtcType.rx8035) offset = 1; else offset = 0;

        switch (deviceType) {
            case rtcType.rx8035:
                break;
            default:
                pins.i2cWriteNumber(I2C_ADDR, REG_SECOND, NumberFormat.UInt8BE);
        }
        let buf = getRawData();

        retbuf[0] = HexToDec(buf[6 + offset])            // year
        retbuf[1] = HexToDec(buf[5 + offset] & 0x1f)    // month
        if (REG_SEQ == 0) {
            retbuf[2] = HexToDec(buf[4 + offset] & 0x3f)      // day
            retbuf[3] = HexToDec(buf[3 + offset] & 0x07) - weekStart;
        } else {
            retbuf[2] = HexToDec(buf[3 + offset] & 0x3f)      // day
            retbuf[3] = HexToDec(buf[4 + offset] & 0x07) - weekStart;
        }
        retbuf[4] = HexToDec(buf[2 + offset] & 0x3f)     // hour
        retbuf[5] = HexToDec(buf[1 + offset] & 0x7f)   // minute
        retbuf[6] = HexToDec(buf[0 + offset] & 0x7f)   // second
        return retbuf;
    }

    /**
     * getClockData
     * @param dt clockData, eg:clockData.year
     */
    //% blockId="getClockData" block="clock %clockData"
    //% advanced=true
    export function getClockData(dt: clockData): clockData {
        return dt;
    }
    /**
     * getClockDevice
     * @param dt rtcType, eg:rtcType.ds3231
     */
    //% blockId="getClockDevice" block="device %clockData"
    //% advanced=true
    export function getClockDevice(dt: rtcType): rtcType {
        return dt;
    }
    /**
     * get RTC RAW DATA
     */
    //% blockId="getRawData" block="get RTC RAW data"
    //% advanced=true
    //% advanced=true
    export function getRawData(): number[] {
        let retbuf = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let buf = pins.i2cReadBuffer(I2C_ADDR, 16);
        for (let i = 0; i < 16; i++) {
            retbuf[i] = buf[i]
        }
        return retbuf;
    }
    let wYear:number;
    let wDays:number;
    let leapYear:number;
    /**
     * getHour
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="getHour" block="getHour %DateTime"
    //% advanced=true
	export function getHour (DateTime: number) : number {
	    return Math.trunc(DateTime / 3600) % 24
	}
    /**
     * getMinute
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="getMinute" block="getMinute %DateTime"
    //% advanced=true
	export function getMinute (DateTime: number) : number {
	    return Math.trunc(DateTime / 60) % 60
	}
    /**
     * getSecond
     * @param DateTime Date & Time, eg:1234567890
     */
    //% advanced=true
    //% blockId="getSecond" block="getSecond %DateTime"
	export function getSecond (DateTime: number) : number {
	    return DateTime % 60
	}
	function getDays (DateTime: number) : number {
	    return Math.trunc(DateTime / 86400)
	}
    /**
     * getYear
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="getYear" block="getYear %DateTime"
    //% advanced=true
	export function getYear (Datetime: number) : number {
	    wYear = Math.trunc((getDays(Datetime) + 0.5) / 365.25)
	    return wYear + 1970
	}
    /**
     * getMonth
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="getMonth" block="getMonth %DateTime"
    //% advanced=true
	export function getMonth (Datetime: number) : number {
	    wYear = getYear(Datetime)
	    wDays = getDays(Datetime) - ((wYear - 1970) * 365 + Math.ceil((wYear - 1972) / 4))
	    if (wYear % 4 == 0) {
	        leapYear = 1
	    } else {
	        leapYear = 0
	    }
	    if (wDays > 333 + leapYear) {
	        return 12
	    } else if (wDays > 303 + leapYear) {
	        return 11
	    } else if (wDays > 272 + leapYear) {
	        return 10
	    } else if (wDays > 242 + leapYear) {
	        return 9
	    } else if (wDays > 211 + leapYear) {
	        return 8
	    } else if (wDays > 180 + leapYear) {
	        return 7
	    } else if (wDays > 150 + leapYear) {
	        return 6
	    } else if (wDays > 119 + leapYear) {
	        return 5
	    } else if (wDays > 89 + leapYear) {
	        return 4
	    } else if (wDays > 58 + leapYear) {
	        return 3
	    } else if (wDays > 30 + 0) {
	        return 2
	    } else {
	        return 1
	    }
	}
    /**
     * getDay
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="getDay" block="getDay %DateTime"
    //% advanced=true
	export function getDay (Datetime: number) : number {
	    wYear = getYear(Datetime)
	    wDays = getDays(Datetime) - ((wYear - 1970) * 365 + Math.ceil((wYear - 1972) / 4))
	    if (wYear % 4 == 0) {
	        leapYear = 1
	    } else {
	        leapYear = 0
	    }
	    if (wDays > 333 + leapYear) {
	        return wDays - (333 + leapYear)
	    } else if (wDays > 303 + leapYear) {
	        return wDays - (303 + leapYear)
	    } else if (wDays > 272 + leapYear) {
	        return wDays - (272 + leapYear)
	    } else if (wDays > 242 + leapYear) {
	        return wDays - (242 + leapYear)
	    } else if (wDays > 211 + leapYear) {
	        return wDays - (211 + leapYear)
	    } else if (wDays > 180 + leapYear) {
	        return wDays - (180 + leapYear)
	    } else if (wDays > 150 + leapYear) {
	        return wDays - (150 + leapYear)
	    } else if (wDays > 119 + leapYear) {
	        return wDays - (119 + leapYear)
	    } else if (wDays > 89 + leapYear) {
	        return wDays - (89 + leapYear)
	    } else if (wDays > 58 + leapYear) {
	        return wDays - (58 + leapYear)
	    } else if (wDays > 30 + 0) {
	        return wDays - (30 + 0)
	    } else {
	        return wDays + 1
	    }
	}
    /**
     * getWeekday
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="getWeekday" block="getWeekday %DateTime"
    //% advanced=true
	export     function getWeekday (DateTime: number) :number{
        return (getDays(DateTime) + 4) % 7
    }
    /**
     * getData
     * @param DateTime Date & Time, eg:1234567890
     * @param dt clockData, eg:clockData.year
     */
    //% blockId="getData" block="getData %DateTime of %dt"
	export function getData (DateTime: number,dt: clockData):number {
        switch(dt){
            case clockData.year:
                return getYear(DateTime);
            case clockData.month:
                return getMonth(DateTime);
            case clockData.day:
                return getDay(DateTime);
            case clockData.weekday:
                return getWeekday(DateTime);
            case clockData.hour:
                return getHour(DateTime);
            case clockData.minute:
                return getMinute(DateTime);
            case clockData.second:
                return getSecond(DateTime);
            default:
                return 0;
        }
    }
    /**
     * convDateTime
     * @param year year of date,   eg:2009
     * @param month month of date,  eg:2
     * @param day day of date,    eg:13
     * @param hour houe of time,   eg:23
     * @param minute monute of time, eg:31
     * @param second second of time, eg:30
     */
    //% blockId="convDateTime" block="convDateTime year %year month %month day %day hour %hour minute %minute second %second"
	export function convDateTime (year: number, month: number, day: number, hour: number, minute: number, second: number) : number {
	    wYear = year - 1970
	    if (year % 4 == 0) {
	        leapYear = 1
	    } else {
	        leapYear = 0
	    }
	    wDays = wYear * 365 + Math.ceil((wYear - 2) / 4)
	    if (month == 1) {
	        wDays += day - 1
	    } else if (month == 2) {
	        wDays += day + 30 + 0
	    } else if (month == 3) {
	        wDays += day + 58 + leapYear
	    } else if (month == 4) {
	        wDays += day + 89 + leapYear
	    } else if (month == 5) {
	        wDays += day + 119 + leapYear
	    } else if (month == 6) {
	        wDays += day + 150 + leapYear
	    } else if (month == 7) {
	        wDays += day + 180 + leapYear
	    } else if (month == 8) {
	        wDays += day + 211 + leapYear
	    } else if (month == 9) {
	        wDays += day + 242 + leapYear
	    } else if (month == 10) {
	        wDays += day + 272 + leapYear
	    } else if (month == 11) {
	        wDays += day + 303 + leapYear
	    } else if (month == 12) {
	        wDays += day + 333 + leapYear
	    }
	    return ((wDays * 24 + hour) * 60 + minute) * 60 + second
	}
    /**
     * getDatetime
     */
    //% blockId="getDatetime" block="getDatetime"
	export function getDatetime ():number {
        let cd=getClock();
        if(cd[clockData.year]<70){
            return convDateTime(cd[clockData.year]+2000,cd[clockData.month],cd[clockData.day],cd[clockData.hour],cd[clockData.minute],cd[clockData.second])
        } else if(cd[clockData.year]<100){
            return convDateTime(cd[clockData.year]+1900,cd[clockData.month],cd[clockData.day],cd[clockData.hour],cd[clockData.minute],cd[clockData.second])
        } else {
            return convDateTime(cd[clockData.year],cd[clockData.month],cd[clockData.day],cd[clockData.hour],cd[clockData.minute],cd[clockData.second])
        }
    }
    /**
     * gsetDatetime
     * @param DateTime Date & Time, eg:1234567890
     */
    //% blockId="setDatetime" block="setDatetime %DateTime"
	export function setDatetime (DateTime:number):void {
        setClock(getYear(DateTime),getMonth(DateTime),getDay(DateTime),getWeekday(DateTime),getHour(DateTime),getMinute(DateTime),getSecond(DateTime));
    }
}
