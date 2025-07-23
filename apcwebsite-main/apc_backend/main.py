from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from datetime import datetime
import os

CSV_FILE = "registrations.csv"

# Create app
app = FastAPI(title="Programming Club API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.1.36:3000",
        "https://apcweb.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure CSV file exists
if not os.path.exists(CSV_FILE):
    df = pd.DataFrame(columns=[
        "FullName", "Email", "Phone", "Year", "Branch",
        "Programming_Experience", "Interests", "GitHub_Profile",
        "Attended_Before", "Timestamp"
    ])
    df.to_csv(CSV_FILE, index=False)

@app.get("/")
def home():
    return {
        "message": "✅ FastAPI Backend Running",
        "status": "OK"
    }

@app.post("/register")
async def register(request: Request):
    try:
        data = await request.json()
        print("Received data:", data)

        # Append to CSV
        row = {
            "FullName": data.get("FullName", ""),
            "Email": data.get("Email", ""),
            "Phone": data.get("Phone", ""),
            "Year": data.get("Year", ""),
            "Branch": data.get("Branch", ""),
            "Programming_Experience": data.get("Programming_Experience", ""),
            "Interests": data.get("Interests", ""),
            "GitHub_Profile": data.get("GitHub_Profile", ""),
            "Attended_Before": "Yes" if data.get("boolean_before") else "No",
            "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        df = pd.read_csv(CSV_FILE)
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
        df.to_csv(CSV_FILE, index=False)

        return {
            "message": "🎉 Registration successful!",
            "saved": True
        }

    except Exception as e:
        print("❌ Error:", e)
        raise HTTPException(status_code=500, detail="Failed to save registration")

