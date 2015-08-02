from orientation import Orientation
from distancemeter import Distancemeter

distance = Distancemeter()
value = distance.measure_average()

orientation = Orientation()
orientationData = orientation.getOrientation()
orientationData.append(value)

print orientationData
