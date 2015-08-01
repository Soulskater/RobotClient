from orientation import Orientation
from distancemeter import Distancemeter

orientation = Orientation()
orientationData = orientation.getOrientation()
distanceInstance = Distancemeter()
distance = distanceInstance.measure_average()
orientationData.append(distance)

print orientationData
