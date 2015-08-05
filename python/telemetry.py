from Orientation import Orientation
from UltraSonicSensor import UltraSonicSensor

sensor = UltraSonicSensor()
value = sensor.getReadings()

orientation = Orientation()
orientationData = orientation.getOrientation()
orientationData.append(value)
print orientationData
