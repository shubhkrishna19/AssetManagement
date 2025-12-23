try:
    import pandas as pd
    import openpyxl
    print("Pandas and Openpyxl are available.")
except ImportError as e:
    print(f"Missing dependency: {e}")
