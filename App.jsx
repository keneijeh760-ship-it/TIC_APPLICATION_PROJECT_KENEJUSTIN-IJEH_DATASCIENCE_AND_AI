import './App.css'
import { useState } from 'react'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)
    const payload = {}
    form.forEach((v, k) => (payload[k] = v))

    try {
      // Send to Flask backend /predict endpoint
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      let data
      try {
        data = await res.json()
      } catch {
        throw new Error('Invalid or empty JSON response from backend.')
      }

      if (!res.ok) {
        throw new Error(data?.error || `Server error: ${res.status}`)
      }

      setPrediction(data.message)
      setError(null)
    } catch (err) {
      console.error('Prediction request failed:', err)
      setError(err.message)
      setPrediction(null)
    }
  }

  return (
    <>
      <header className="header">
        <div className="brand">My TIC Project</div>

        <nav className="nav-links" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                My Github
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <div className="content">
          <h2>Predict Student Performance</h2>

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <label>Attendance Rate (%)</label>
            <input type="number" name="Attendance_Rate" min="0" max="100" required />
            <br />

            <label>Study Hours Per Week</label>
            <input type="number" name="Study_Hours_Per_Week" min="0" required />
            <br />

            <label>Sleep Hours (per day)</label>
            <input type="number" name="Sleep_Hours" min="0" max="24" required />
            <br />

            <label>Part-Time Job</label>
            <select name="Part_Time_Job" required>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <br />

            <label>Internet Usage (hours per day)</label>
            <input type="number" name="Internet_Usage_Hrs" min="0" required />
            <br />

            <label>Assignments Completed (%)</label>
            <input type="number" name="Assignments_Completed" min="0" max="100" required />
            <br />

            <label>Club Involvement</label>
            <select name="Club_Involvement" required>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="None">None</option>
            </select>
            <br />

            <label>Parent Education Level</label>
            <select name="Parent_Education_Level" required>
              <option value="High School">High School</option>
              <option value="College">College</option>
              <option value="Graduate">Graduate</option>
              <option value="None">None</option>
            </select>
            <br />

            <button type="submit">Predict Performance</button>
          </form>

          {prediction && (
            <div className="prediction" style={{ marginTop: '1rem', color: '#0f0' }}>
              <strong>Prediction:</strong> {prediction}
            </div>
          )}

          {error && (
            <div className="error" style={{ marginTop: '1rem', color: '#f00' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App