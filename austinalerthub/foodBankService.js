@echo off
REM ======================================================
REM Setup Script for Central Texas Food Bank Integration
REM Created for RiverHacks 2025
REM ======================================================

echo Starting Food Bank Integration Setup...
echo.

REM Set the project root directory (change this to your project path)
set PROJECT_ROOT=%CD%

REM Create directories if they don't exist
echo Creating directory structure...
if not exist "%PROJECT_ROOT%\src\services" mkdir "%PROJECT_ROOT%\src\services"
if not exist "%PROJECT_ROOT%\src\components\foodBank" mkdir "%PROJECT_ROOT%\src\components\foodBank"
if not exist "%PROJECT_ROOT%\src\components\emergency" mkdir "%PROJECT_ROOT%\src\components\emergency"
if not exist "%PROJECT_ROOT%\src\styles" mkdir "%PROJECT_ROOT%\src\styles"

REM Create service file
echo Creating Food Bank service file...
(
  echo /**
  echo  * Central Texas Food Bank Service
  echo  * 
  echo  * Provides integration with CTFB data including:
  echo  * - Food bank locations and mobile pantries
  echo  * - Emergency food distribution events
  echo  * - Volunteer opportunities
  echo  * 
  echo  * Created for RiverHacks 2025
  echo  */
  echo import axios from 'axios';
  echo import { db } from '../data/database';
  echo.
  echo // Central Texas Food Bank API ^(mock for hackathon^)
  echo const AUSTIN_OPEN_DATA_BASE_URL = 'https://data.austintexas.gov/resource/';
  echo.
  echo export const FoodBankService = {
  echo   /**
  echo    * Get all Central Texas Food Bank locations and mobile pantries
  echo    * @param {Object} location - Optional user location for proximity sorting
  echo    * @returns {Promise^<Array^>} Promise resolving to food bank locations
  echo    */
  echo   getLocations: async ^(location^) =^> {
  echo     try {
  echo       // Mock implementation for hackathon
  echo       const response = await axios.get^(`${AUSTIN_OPEN_DATA_BASE_URL}/food_pantries.json?$limit=100`^);
  echo       
  echo       // Add CTFB main location
  echo       const locations = [...response.data, {
  echo         id: 'ctfb-main',
  echo         name: 'Central Texas Food Bank - Main Facility',
  echo         address: '6500 Metropolis Dr, Austin, TX 78744',
  echo         phone: '^(512^) 282-2111',
  echo         website: 'https://centraltexasfoodbank.org',
  echo         latitude: 30.1957,
  echo         longitude: -97.7381,
  echo         isCTFB: true,
  echo         servesWeekly: 70000
  echo       }];
  echo       
  echo       // Store in local database for offline access
  echo       await db.foodBankLocations.bulkPut^(locations^);
  echo       
  echo       return locations;
  echo     } catch ^(error^) {
  echo       console.warn^('Fetching from local database:', error^);
  echo       return db.foodBankLocations.toArray^(^);
  echo     }
  echo   },
  echo   
  echo   // Additional methods would go here...
  echo };
  echo.
  echo export default FoodBankService;
) > "%PROJECT_ROOT%\src\services\foodBankService.js"

REM Create FoodBankLocationsMap component
echo Creating FoodBankLocationsMap component...
(
  echo /**
  echo  * Food Bank Locations Map Component
  echo  * Displays Central Texas Food Bank locations on the map
  echo  * 
  echo  * Created for RiverHacks 2025
  echo  */
  echo import React, { useEffect, useState } from 'react';
  echo import FoodBankService from '../../services/foodBankService';
  echo.
  echo const FoodBankLocationsMap = ^({ map, userLocation }^) =^> {
  echo   const [locations, setLocations] = useState^([]);
  echo   
  echo   useEffect^(^(^) =^> {
  echo     const loadLocations = async ^(^) =^> {
  echo       const data = await FoodBankService.getLocations^(userLocation^);
  echo       setLocations^(data^);
  echo     };
  echo     
  echo     loadLocations^(^);
  echo   }, [userLocation]);
  echo   
  echo   // Map implementation would go here
  echo   
  echo   return ^(
  echo     ^<div className="food-bank-map"^>
  echo       {/* Map rendering would go here */}
  echo     ^</div^>
  echo   ^);
  echo };
  echo.
  echo export default FoodBankLocationsMap;
) > "%PROJECT_ROOT%\src\components\foodBank\FoodBankLocationsMap.js"

REM Create FoodBankEventsWidget component
echo Creating FoodBankEventsWidget component...
(
  echo /**
  echo  * Food Bank Events Widget
  echo  * Displays upcoming emergency food distribution events
  echo  * 
  echo  * Created for RiverHacks 2025
  echo  */
  echo import React, { useState, useEffect } from 'react';
  echo import FoodBankService from '../../services/foodBankService';
  echo.
  echo const FoodBankEventsWidget = ^(^) =^> {
  echo   const [events, setEvents] = useState^([]);
  echo   
  echo   useEffect^(^(^) =^> {
  echo     // Implementation would load events from service
  echo     setEvents^([
  echo       {
  echo         id: 'dist-001',
  echo         name: 'Emergency Food Distribution - Del Valle',
  echo         location: 'Del Valle High School',
  echo         date: '2025-04-29T09:00:00',
  echo         type: 'drive-through'
  echo       }
  echo     ]);
  echo   }, []);
  echo   
  echo   return ^(
  echo     ^<div className="food-events-widget"^>
  echo       ^<h3^>Emergency Food Distribution^</h3^>
  echo       ^<div className="events-list"^>
  echo         {events.map^(event =^> ^(
  echo           ^<div key={event.id} className="event-item"^>
  echo             ^<h4^>{event.name}^</h4^>
  echo             ^<p^>{event.location}^</p^>
  echo           ^</div^>
  echo         ^))}
  echo       ^</div^>
  echo     ^</div^>
  echo   ^);
  echo };
  echo.
  echo export default FoodBankEventsWidget;
) > "%PROJECT_ROOT%\src\components\foodBank\FoodBankEventsWidget.js"

REM Create EmergencyFoodSection component
echo Creating EmergencyFoodSection component...
(
  echo /**
  echo  * Emergency Food Section Component
  echo  * Displays food resources during emergencies
  echo  * 
  echo  * Created for RiverHacks 2025
  echo  */
  echo import React from 'react';
  echo import FoodBankEventsWidget from '../foodBank/FoodBankEventsWidget';
  echo.
  echo const EmergencyFoodSection = ^(^) =^> {
  echo   return ^(
  echo     ^<div className="emergency-food-section"^>
  echo       ^<h2^>Emergency Food Resources^</h2^>
  echo       ^<p^>Central Texas Food Bank serves over 70,000 people weekly.^</p^>
  echo       ^<FoodBankEventsWidget /^>
  echo     ^</div^>
  echo   ^);
  echo };
  echo.
  echo export default EmergencyFoodSection;
) > "%PROJECT_ROOT%\src\components\emergency\EmergencyFoodSection.js"

REM Create CSS file
echo Creating CSS styles...
(
  echo /**
  echo  * Food Bank Styles
  echo  * CSS for Central Texas Food Bank components
  echo  * 
  echo  * Created for RiverHacks 2025
  echo  */
  echo.
  echo /* Food Bank Map */
  echo .food-bank-map {
  echo   width: 100%%;
  echo   height: 400px;
  echo   margin-bottom: 20px;
  echo }
  echo.
  echo /* Food Bank Marker */
  echo .food-bank-marker {
  echo   width: 32px;
  echo   height: 32px;
  echo   background-color: #e94e1b;
  echo   border-radius: 50%%;
  echo   display: flex;
  echo   align-items: center;
  echo   justify-content: center;
  echo   color: white;
  echo   font-weight: bold;
  echo }
  echo.
  echo /* Events Widget */
  echo .food-events-widget {
  echo   background-color: white;
  echo   border-radius: 8px;
  echo   box-shadow: 0 2px 4px rgba^(0,0,0,0.1^);
  echo   padding: 16px;
  echo   margin-bottom: 20px;
  echo }
  echo.
  echo .event-item {
  echo   border-bottom: 1px solid #eee;
  echo   padding: 12px 0;
  echo }
  echo.
  echo .event-item:last-child {
  echo   border-bottom: none;
  echo }
  echo.
  echo /* Emergency Section */
  echo .emergency-food-section {
  echo   margin-bottom: 24px;
  echo }
) > "%PROJECT_ROOT%\src\styles\foodBank.css"

REM Create README file
echo Creating README file...
(
  echo # Central Texas Food Bank Integration
  echo.
  echo ## Overview
  echo This integration connects the Austin Resilience Hub Network with the Central Texas Food Bank ^(CTFB^), a critical emergency resource serving over 70,000 people weekly in the Austin area.
  echo.
  echo ## Features
  echo - Food bank locations and mobile pantries on the map
  echo - Emergency food distribution events listing
  echo - Volunteer opportunities
  echo - Offline support for emergency situations
  echo.
  echo ## Why It Matters
  echo During emergencies, food security becomes a critical issue. The Central Texas Food Bank is the largest hunger relief organization in Central Texas and serves as a vital community resource during disasters.
  echo.
  echo ## Components
  echo - `src/services/foodBankService.js` - API integration
  echo - `src/components/foodBank/*` - UI components
  echo - `src/components/emergency/EmergencyFoodSection.js` - Emergency mode integration
  echo - `src/styles/foodBank.css` - Component styling
  echo.
  echo ## Testing
  echo 1. Start the development server
  echo 2. Navigate to the map to see food bank locations
  echo 3. Check the emergency page for food distribution events
  echo 4. Test offline functionality by disabling network
  echo.
  echo Created for RiverHacks 2025
) > "%PROJECT_ROOT%\README-food-bank.md"

REM Create Git commands file
echo Creating Git commands helper file...
(
  echo @echo off
  echo REM Git commands for Food Bank integration
  echo.
  echo echo 1. Create a new branch:
  echo echo git checkout -b feature/food-bank-integration
  echo.
  echo echo 2. Add your files:
  echo echo git add src/services/foodBankService.js
  echo echo git add src/components/foodBank/*
  echo echo git add src/components/emergency/EmergencyFoodSection.js
  echo echo git add src/styles/foodBank.css
  echo echo git add README-food-bank.md
  echo.
  echo echo 3. Commit your changes:
  echo echo git commit -m "Add Central Texas Food Bank integration with offline support"
  echo.
  echo echo 4. Push to GitHub:
  echo echo git push origin feature/food-bank-integration
  echo.
  echo echo 5. Then go to GitHub to create your pull request
) > "%PROJECT_ROOT%\git-commands.bat"

echo.
echo Setup complete! Files have been created in the following locations:
echo - %PROJECT_ROOT%\src\services\foodBankService.js
echo - %PROJECT_ROOT%\src\components\foodBank\FoodBankLocationsMap.js
echo - %PROJECT_ROOT%\src\components\foodBank\FoodBankEventsWidget.js
echo - %PROJECT_ROOT%\src\components\emergency\EmergencyFoodSection.js
echo - %PROJECT_ROOT%\src\styles\foodBank.css
echo - %PROJECT_ROOT%\README-food-bank.md
echo - %PROJECT_ROOT%\git-commands.bat
echo.
echo Run git-commands.bat to see the Git commands you'll need to use.
echo.
pause
