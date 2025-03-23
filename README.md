This project is an AI-powered dashboard designed for analyzing trading card game (TCG) decks, tracking match statistics, and optimizing deck compositions. Using Reinforcement Learning (DQN/PPO), the AI simulates thousands of matches to understand the game mechanics, identify winning strategies, and provide actionable insights for deck building. The goal is to help players optimize their decks, improve performance, and make data-driven decisions.

Key Features
🃏 Game Simulation & AI Training

Implements full game mechanics, including inkwell management, card interactions, attacking, and lore collection.

Simulates thousands of matches to train the AI on strategic decision-making.

Uses Deep Q-Learning (DQN) and Proximal Policy Optimization (PPO) to refine gameplay strategy.

The AI learns to play optimally, adapting to different deck compositions and playstyles.

📊 Match Tracking & Win Rate Analysis

Logs AI match data to track deck performance over time.

Analyzes win/loss rates, common card plays, and key turn sequences.

Provides insights into deck weaknesses and strengths based on match history.

🔍 Deck Optimization & Recommendations

Suggests card replacements based on performance trends.

Predicts best deck compositions using AI-driven insights.

Helps players build competitive decks by identifying meta-relevant strategies.

🌐 Web Dashboard (Streamlit)

Displays AI-generated insights in a user-friendly dashboard.

Interactive visualizations for win rates, deck performance, and matchup analysis.

Allows users to upload new decks and receive AI recommendations.

🔄 Automated Data Updates

Regularly fetches new cards and decklists after tournaments and set releases.

Ensures the AI remains up to date with the latest meta and strategies.

Tech Stack
AI Model: TensorFlow / PyTorch (Reinforcement Learning - DQN/PPO)

Backend: Python (Flask/Django)

Frontend: Streamlit for interactive data visualization

Database: PostgreSQL / MySQL (card details, match data)

🚀 This AI-powered dashboard helps players improve their decks with smart, data-driven insights!
