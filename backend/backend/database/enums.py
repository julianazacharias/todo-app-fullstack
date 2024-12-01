from enum import Enum


class TaskPriority(str, Enum):
    high = 'high'
    medium = 'medium'
    low = 'low'
