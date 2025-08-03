# Beauty & Outfit Analysis Setup Guide

This guide explains how to set up the complete working beauty and outfit analysis system using Google Vision API and GPT.

## 🚀 Features

- **Real Beauty Analysis**: Uses Google Vision API to detect facial features and GPT to provide personalized beauty scores and recommendations
- **Smart Outfit Analysis**: Analyzes clothing items, color harmony, fit, and event appropriateness
- **AI-Powered Recommendations**: Personalized tips based on user profile and analysis results
- **Celebrity Matches**: Find celebrity lookalikes (beauty analysis)
- **Color Palette Extraction**: Identifies dominant colors in outfits
- **Event-Specific Analysis**: Tailored feedback based on the occasion

## 🔧 Setup Instructions

### 1. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Google Vision API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Vision API
   - Go to Credentials and create an API key
   - Copy the API key to your `.env` file

3. Update `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_VISION_API_KEY=your_actual_api_key_here
   ```

### 2. Dependencies

The following dependencies are already installed:
- `expo-file-system` - For image processing
- `expo-camera` - For photo capture
- `expo-image-picker` - For gallery selection

### 3. Analysis Flow

#### Beauty Analysis:
1. **Photo Capture**: User takes selfie or selects from gallery
2. **Vision API**: Detects facial features, landmarks, and image properties
3. **GPT Analysis**: Processes Vision API results with user profile to generate:
   - Glow score (1-10)
   - Individual scores (skin quality, symmetry, eye beauty, lip definition)
   - Personalized recommendations
   - Celebrity matches (optional)

#### Outfit Analysis:
1. **Photo Capture**: User takes full-body photo or selects from gallery
2. **Event Selection**: User specifies the occasion (work, date, party, etc.)
3. **Vision API**: Detects clothing items, colors, and objects
4. **GPT Analysis**: Processes results with event context to generate:
   - Style score (1-10)
   - Color harmony score
   - Fit & style assessment
   - Event appropriateness score
   - Styling suggestions
   - Color palette extraction

## 📱 Usage

### Beauty Analysis
```typescript
import { analysisService } from '@/services/analysisService';

const result = await analysisService.analyzeBeautyPhoto(imageUri, userProfile);
// Returns: BeautyAnalysisResult with scores and recommendations
```

### Outfit Analysis
```typescript
import { analysisService } from '@/services/analysisService';

const result = await analysisService.analyzeOutfitPhoto(imageUri, event, userProfile);
// Returns: OutfitAnalysisResult with scores and suggestions
```

## 🎯 Analysis Criteria

### Beauty Analysis Factors:
- **Facial Symmetry**: Golden ratio proportions
- **Skin Quality**: Texture, clarity, tone
- **Eye Beauty**: Shape, brightness, definition
- **Lip Definition**: Shape, fullness, color
- **Overall Harmony**: How features work together

### Outfit Analysis Factors:
- **Color Harmony**: Complementary colors, contrast
- **Fit & Style**: Tailoring, proportions, silhouette
- **Event Match**: Appropriateness for occasion
- **Overall Composition**: How elements work together

## 🔒 Privacy & Security

- Images are processed securely through Google Vision API
- No images are stored permanently
- User data is kept private and secure
- Analysis results are stored locally on device

## 🛠 Customization

### Adding New Analysis Criteria:
1. Update the GPT prompts in `analysisService.ts`
2. Modify the scoring algorithms
3. Add new recommendation categories

### Extending Event Types:
1. Add new events to `outfit-analysis.tsx`
2. Update analysis criteria in `analysisService.ts`
3. Customize recommendations for new events

## 📊 Error Handling

The system includes comprehensive error handling:
- Network failures fallback to default scores
- Invalid API responses are sanitized
- User-friendly error messages
- Graceful degradation when APIs are unavailable

## 🚀 Performance Optimization

- Images are compressed before analysis
- Concurrent API calls where possible
- Caching of analysis results
- Optimized for both mobile and web platforms

## 📈 Analytics Integration

Track analysis usage:
- Number of analyses performed
- User engagement with recommendations
- Popular events and styles
- Success rates and user satisfaction

## 🔄 Future Enhancements

Potential improvements:
- Machine learning model training on user feedback
- Advanced facial recognition features
- Style trend analysis
- Social sharing and comparison features
- Integration with shopping platforms