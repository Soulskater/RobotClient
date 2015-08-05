#!/usr/bin/python
from Adafruit_I2C import Adafruit_I2C
import sys
import math


class Vector():
    def __init__(self, data):
        self.x = data[0]
        self.y = data[1]
        self.z = data[2]


class Magnetometer(Adafruit_I2C):
    LSM303_ADDRESS_MAG = (0x3C >> 1)  # 0011110x

    LSM303_REGISTER_MAG_CRB_REG_M = 0x01
    LSM303_REGISTER_MAG_MR_REG_M = 0x02

    LSM303DLHC_REGISTER_MAG_OUT_X_H_M = 0x03
    LSM303DLHC_REGISTER_MAG_OUT_X_L_M = 0x04
    LSM303DLHC_REGISTER_MAG_OUT_Z_H_M = 0x05
    LSM303DLHC_REGISTER_MAG_OUT_Z_L_M = 0x06
    LSM303DLHC_REGISTER_MAG_OUT_Y_H_M = 0x07
    LSM303DLHC_REGISTER_MAG_OUT_Y_L_M = 0x08

    # Gain settings for setMagGain()
    LSM303_MAGGAIN_1_3 = 0x20  # +/- 1.3
    LSM303_MAGGAIN_1_9 = 0x40  # +/- 1.9
    LSM303_MAGGAIN_2_5 = 0x60  # +/- 2.5
    LSM303_MAGGAIN_4_0 = 0x80  # +/- 4.0
    LSM303_MAGGAIN_4_7 = 0xA0  # +/- 4.7
    LSM303_MAGGAIN_5_6 = 0xC0  # +/- 5.6
    LSM303_MAGGAIN_8_1 = 0xE0  # +/- 8.1

    SENSORS_MAGFIELD_EARTH_MAX = 60.0
    SENSORS_MAGFIELD_EARTH_MIN = 30.0
    LSM303_Mag_Gauss_LSB_XY = 1100.0
    LSM303_Mag_Gauss_LSB_Z = 980.0
    SENSORS_GAUSS_TO_MICROTESLA = 100

    def __init__(self, busnum=-1, debug=False):

        # Accelerometer and magnetometer are at different I2C
        # addresses, so invoke a separate I2C instance for each
        self.mag = Adafruit_I2C(self.LSM303_ADDRESS_MAG, busnum, debug)
        self._magGain = self.LSM303_MAGGAIN_1_3
        self.setMagGain(self._magGain)
        self.magFactor = 1 / 855.0

        # Enable the magnetometer
        self.mag.write8(self.LSM303_REGISTER_MAG_MR_REG_M, 0x00)

        self.m_max_x = 1440
        self.m_max_y = 1492
        self.m_max_z = 1743
        self.m_min_x = -2410
        self.m_min_y = -2311
        self.m_min_z = -1813

    def readMagnetics(self):
        xlo = self.mag.readU8(self.LSM303DLHC_REGISTER_MAG_OUT_X_L_M)
        xhi = self.mag.readU8(self.LSM303DLHC_REGISTER_MAG_OUT_X_H_M)
        ylo = self.mag.readU8(self.LSM303DLHC_REGISTER_MAG_OUT_Y_L_M)
        yhi = self.mag.readU8(self.LSM303DLHC_REGISTER_MAG_OUT_Y_H_M)
        zlo = self.mag.readU8(self.LSM303DLHC_REGISTER_MAG_OUT_Z_L_M)
        zhi = self.mag.readU8(self.LSM303DLHC_REGISTER_MAG_OUT_Z_H_M)

        magData = Vector([
            (((xhi & 0x000F) << 8) + xlo),
            (((yhi & 0x000F) << 8) + ylo),
            (((zhi & 0x000F) << 8) + zlo)])

        return magData

    def __twos_comp(self, val, bits):
        if (val & (1 << (bits - 1))) != 0:
            val = val - (1 << bits)
        return val

    def readMagneticsGauss(self):
        x_error = (self.m_max_x + self.m_min_x) / 2
        y_error = (self.m_max_y + self.m_min_y) / 2
        z_error = (self.m_max_z + self.m_min_z) / 2
        magData = self.readMagnetics()

        real_x = self.__twos_comp(magData.x, 12)# - x_error
        real_y = self.__twos_comp(magData.y, 12)# - y_error
        real_z = self.__twos_comp(magData.z, 12)# - z_error

        # if real_x > self.m_max_x:
        #     self.m_max_x = real_x
        # if real_x < self.m_min_x:
        #     self.m_min_x = real_x
        #
        # if real_y > self.m_max_y:
        #     self.m_max_y = real_y
        # if real_y < self.m_min_y:
        #     self.m_min_y = real_y
        #
        # if real_z > self.m_max_z:
        #     self.m_max_z = real_z
        # if real_z < self.m_min_z:
        #     self.m_min_z = real_z
        #
        # print "raw max data %d, %d, %d" % (self.m_max_x, self.m_max_y, self.m_max_z)
        # print "raw min data %d, %d, %d" % (self.m_min_x, self.m_min_y, self.m_min_z)

        magVal3D = Vector([
            real_x * self.magFactor,
            real_y * self.magFactor,
            real_z * self.magFactor
        ])
        return magVal3D

    def readMagneticHeading(self):
        magData = self.readMagneticsGauss()
        return math.degrees(math.atan2(magData.y, magData.x))

    def readRaw(self):
        magData = self.mag.readList(self.LSM303_REGISTER_MAG_OUT_X_H_M, 6)
        magX = self.mag16(magData, 0)
        magY = self.mag16(magData, 2)
        magZ = self.mag16(magData, 4)
        res = [magX,
               magY,
               magZ]
        return res

    def setMagGain(self, gain=LSM303_MAGGAIN_1_3):
        self.mag.write8(self.LSM303_REGISTER_MAG_CRB_REG_M, gain)
        self._magGain = gain

        if gain == self.LSM303_MAGGAIN_1_3:
            self.LSM303_Mag_Gauss_LSB_XY = 1100
            self.LSM303_Mag_Gauss_LSB_Z = 980
        elif gain == self.LSM303_MAGGAIN_1_9:
            self.LSM303_Mag_Gauss_LSB_XY = 855
            self.LSM303_Mag_Gauss_LSB_Z = 760
        elif gain == self.LSM303_MAGGAIN_2_5:
            self.LSM303_Mag_Gauss_LSB_XY = 670
            self.LSM303_Mag_Gauss_LSB_Z = 600
        elif gain == self.LSM303_MAGGAIN_4_0:
            self.LSM303_Mag_Gauss_LSB_XY = 450
            self.LSM303_Mag_Gauss_LSB_Z = 400
        elif gain == self.LSM303_MAGGAIN_4_7:
            self.LSM303_Mag_Gauss_LSB_XY = 400
            self.LSM303_Mag_Gauss_LSB_Z = 355
        elif gain == self.LSM303_MAGGAIN_5_6:
            self.LSM303_Mag_Gauss_LSB_XY = 330
            self.LSM303_Mag_Gauss_LSB_Z = 295
        elif gain == self.LSM303_MAGGAIN_8_1:
            self.LSM303_Mag_Gauss_LSB_XY = 230
            self.LSM303_Mag_Gauss_LSB_Z = 205
