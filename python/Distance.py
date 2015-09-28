from UltraSonicSensor import UltraSonicSensor

sensorLeft = UltraSonicSensor(17, 27)
valueLeft = sensorLeft.getReadings()
sensorRight = UltraSonicSensor(8, 7)
valueRight = sensorRight.getReadings()

print [valueLeft, valueRight]