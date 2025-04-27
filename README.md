# SafeSpot Austin

SafeSpot Austin is a citizen-powered safety reporting and monitoring platform built during RiverHacks25. This application enables residents to report safety concerns across Austin, facilitating collaboration between citizens and city officials to make Austin safer.

![SafeSpot Austin](./SafeSpot%20Logo.png?text=SafeSpot+Austin)

## 🌟 Features

- **Real-time Incident Reporting**: Report safety concerns with geolocation tagging
- **Interactive Maps**: Visualize safety issues across Austin with heat maps and clustering 
- **Data Analytics**: Track trends and visualize safety statistics across neighborhoods
- **Community Verification**: Upvote legitimate concerns, mark resolved issues
- **Agency Integration**: Direct routing of reports to relevant city departments

## 🏆 Project Track

This project was developed for RiverHacks25 in the **Austin Community Engagement Track**, aiming to enhance civic safety and participation.

## 🧰 Tech Stack

### Backend
- Flask (Python web framework)
- RESTful API architecture
- Data integration with Austin Open Data Portal

### Frontend
- React.js
- React Router for navigation
- Leaflet.js for interactive maps
- Chart.js for data visualization

## 📊 Data Sources

SafeSpot Austin leverages several datasets from the [Austin Open Data Portal](https://data.austintexas.gov/):
- Crime Reports: https://data.austintexas.gov/Public-Safety/Crime-Reports/fdj4-gpfu
- 311 Service Requests: https://data.austintexas.gov/dataset/311-Unified-Data/i26j-ai4z
- Street Segments: https://data.austintexas.gov/dataset/Street-Segments/6ab4-ej5v
- Traffic Incidents: https://data.austintexas.gov/Transportation-and-Mobility/Real-Time-Traffic-Incident-Reports/dx9v-zd7x

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- npm or yarn
- pip

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/safespot-austin.git
cd safespot-austin/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

### Frontend Setup

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at http://localhost:8080

## 📱 Usage

1. **Report an Issue**: 
   - Click "Report Issue" button
   - Allow location access or enter coordinates
   - Select category and add description
   - Upload photo evidence (optional)
   - Submit report

2. **Explore Issues**: 
   - Navigate the interactive map
   - Filter reports by category, status, or date
   - Click on markers to view details

3. **Track Statistics**: 
   - View citywide safety trends
   - See resolution rates by category
   - Compare neighborhood safety metrics

## 🛠️ Future Enhancements

- User authentication for report tracking
- Mobile app versions (iOS/Android)
- Machine learning for issue classification
- Integration with emergency services API
- Automated alerts for recurring issues

## 👥 Contributors

- [Hiram Riddle](https://github.com/riddle015) - Full Stack Developer
- [Abel Rincon](https://github.com/onebrownguy) - Frontend Developer
- [Michael Weber](https://github.com/michael-weberjr) - Data Scientist
- [Christian Lindquist](https://github.com/talonkinkade) - Backend Developer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Austin Open Data Portal](https://data.austintexas.gov/) for providing datasets
- [RiverHacks25](https://riverhacks.org) organizers and sponsors
- [Leaflet](https://leafletjs.com/) for mapping capabilities
- [Chart.js](https://www.chartjs.org/) for data visualization tools
