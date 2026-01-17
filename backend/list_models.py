#!/usr/bin/env python3
"""
Script pour lister les modèles Gemini disponibles
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ GEMINI_API_KEY n'est pas défini dans .env")
    exit(1)

genai.configure(api_key=api_key)

print("Recherche des modèles disponibles...")
print("=" * 60)

try:
    # Lister les modèles disponibles
    models = genai.list_models()
    
    print("\n✅ Modèles disponibles:\n")
    for model in models:
        if 'generateContent' in model.supported_generation_methods:
            print(f"  - {model.name}")
            print(f"    Description: {model.display_name}")
            print(f"    Méthodes supportées: {model.supported_generation_methods}")
            print()
    
    # Essayer de trouver un modèle qui fonctionne
    print("\n" + "=" * 60)
    print("Test des modèles...\n")
    
    test_models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash-001"]
    
    for model_name in test_models:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("test")
            print(f"✅ {model_name} : FONCTIONNE")
            break
        except Exception as e:
            print(f"❌ {model_name} : {str(e)[:80]}")

except Exception as e:
    print(f"❌ Erreur: {e}")


