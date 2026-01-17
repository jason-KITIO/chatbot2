#!/usr/bin/env python3
"""
Script d'aide pour configurer le fichier .env avec la clé API Gemini
"""

import os
from pathlib import Path

def setup_env():
    """Configure le fichier .env interactivement"""
    
    env_path = Path(".env")
    
    print("=" * 60)
    print("🔑 Configuration du fichier .env pour Gemini API")
    print("=" * 60)
    print()
    
    # Vérifier si le fichier existe
    if not env_path.exists():
        print("❌ Le fichier .env n'existe pas !")
        print("   Création du fichier à partir de env.example...")
        example_path = Path("env.example")
        if example_path.exists():
            env_path.write_text(example_path.read_text())
            print("✅ Fichier .env créé !")
        else:
            print("❌ Le fichier env.example n'existe pas non plus !")
            return
    
    # Lire le contenu actuel
    current_content = env_path.read_text()
    
    # Vérifier si la clé est déjà configurée
    if "votre_cle_api_gemini_ici" not in current_content and "GEMINI_API_KEY=" in current_content:
        print("✅ Le fichier .env semble déjà configuré avec une clé API !")
        print()
        choice = input("Voulez-vous la modifier ? (o/n): ").lower()
        if choice != 'o':
            print("✅ Configuration conservée.")
            return
    
    print()
    print("📋 Pour obtenir votre clé API Gemini :")
    print("   1. Allez sur : https://makersuite.google.com/app/apikey")
    print("   2. Connectez-vous avec votre compte Google")
    print("   3. Cliquez sur 'Get API Key' ou 'Créer une clé API'")
    print("   4. Copiez la clé générée")
    print()
    print("💡 La clé commence généralement par 'AIzaSy...'")
    print()
    
    api_key = input("Collez votre clé API Gemini ici (ou appuyez sur Entrée pour garder l'actuelle): ").strip()
    
    if not api_key:
        print("✅ Aucune modification effectuée.")
        return
    
    # Valider le format de la clé (commence généralement par AIzaSy)
    if not api_key.startswith("AIzaSy"):
        print()
        print("⚠️  ATTENTION : La clé ne commence pas par 'AIzaSy'")
        confirm = input("   Êtes-vous sûr que c'est la bonne clé ? (o/n): ").lower()
        if confirm != 'o':
            print("❌ Configuration annulée.")
            return
    
    # Mettre à jour le fichier
    lines = current_content.split('\n')
    updated_lines = []
    
    for line in lines:
        if line.startswith("GEMINI_API_KEY="):
            updated_lines.append(f"GEMINI_API_KEY={api_key}")
        else:
            updated_lines.append(line)
    
    env_path.write_text('\n'.join(updated_lines))
    
    print()
    print("✅ Fichier .env mis à jour avec succès !")
    print()
    print("🔒 RAPPEL DE SÉCURITÉ :")
    print("   - Ne partagez JAMAIS votre clé API publiquement")
    print("   - Le fichier .env est déjà dans .gitignore (ne sera pas commité)")
    print("   - Si vous partagez la clé accidentellement, révoquez-la sur Google AI Studio")
    print()
    print("✅ Vous pouvez maintenant démarrer le serveur avec : python main.py")

if __name__ == "__main__":
    try:
        setup_env()
    except KeyboardInterrupt:
        print("\n\n❌ Configuration annulée par l'utilisateur.")
    except Exception as e:
        print(f"\n❌ Erreur lors de la configuration : {e}")


