from typing import List, Dict
from dataclasses import dataclass
from enum import Enum


class Color(Enum):
    """Color enumeration."""
    RED = 1
    GREEN = 2
    BLUE = 3


@dataclass
class Person:
    """Person dataclass."""
    name: str
    age: int
    hobbies: List[str]


def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"


def add(*args: int, multiplier: int = 1) -> int:
    """Return the sum of numbers multiplied by a factor."""
    return sum(args) * multiplier


def process_list(items: List[int]) -> Dict[str, int]:
    """Process list with comprehension and lambda."""
    squared = [x**2 for x in items if x % 2 == 0]
    result = {"count": len(squared), "sum": sum(squared)}
    return result


async def async_operation():
    """Async function example."""
    import asyncio
    await asyncio.sleep(0.1)
    return "Done!"


class Calculator:
    """Calculator class with decorators."""
    
    def __init__(self, initial: int = 0):
        self._value = initial
    
    @property
    def value(self) -> int:
        """Get the current value."""
        return self._value
    
    @staticmethod
    def multiply(a: int, b: int) -> int:
        """Static method for multiplication."""
        return a * b
    
    @classmethod
    def from_string(cls, value_str: str):
        """Create instance from string."""
        return cls(int(value_str))


def main():
    """Main function showcasing various Python features."""
    # String operations and f-strings
    print(greet("World"))
    
    # Type hints and multiple parameters
    result = add(2, 3, 5, multiplier=2)
    print(f"2 + 3 + 5 with multiplier 2 = {result}")
    
    # List comprehension and dictionaries
    data = process_list([1, 2, 3, 4, 5])
    print(f"Processed data: {data}")
    
    # Class instantiation and dataclass
    person = Person("Alice", 30, ["reading", "coding"])
    print(f"Person: {person}")
    
    # Enum usage
    color = Color.BLUE
    print(f"Selected color: {color.name}")
    
    # Lambda and map
    numbers = [1, 2, 3, 4]
    doubled = list(map(lambda x: x * 2, numbers))
    print(f"Doubled numbers: {doubled}")
    
    # Class methods and properties
    calc = Calculator(10)
    print(f"Calculator value: {calc.value}")
    print(f"Static multiply: {Calculator.multiply(3, 4)}")


if __name__ == "__main__":
    main()
