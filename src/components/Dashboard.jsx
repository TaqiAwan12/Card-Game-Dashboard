import React, { useState, useEffect } from 'react';
// Direct imports of JSON files
import cardsData from './data/cards.json';
import matchHistoryData from './data/match_history.json';
import predictedDecksData from './data/predicted_decks.json';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [predictedDecks, setPredictedDecks] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [newCard, setNewCard] = useState({
    name: '',
    cost: 0,
    attack: 0,
    defense: 0,
    abilities: [],
    lore_value: 0,
    song_effect: ''
  });
  const [abilityInput, setAbilityInput] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  // Load data from JSON files
  useEffect(() => {
    // Set state with imported JSON data
    setCards(cardsData);
    setMatchHistory(matchHistoryData);
    setPredictedDecks(predictedDecksData);
  }, []);

  // Function to save data back to JSON
  const saveData = (type, data) => {
    // In a real implementation, you would use a backend API endpoint
    // For a purely frontend solution, you can use localStorage as a temporary solution
    localStorage.setItem(type, JSON.stringify(data));
    
    // If you're using Electron or a similar framework that allows file system access:
    // const fs = window.require('fs');
    // fs.writeFileSync(`./data/${type}.json`, JSON.stringify(data, null, 2));
  };

  // Calculate win rates for decks
  const calculateDeckStats = () => {
    const deckWins = {};
    const deckGames = {};
    
    matchHistory.forEach(match => {
      const deckKey = match.deck.sort((a, b) => a - b).join('-');
      if (!deckGames[deckKey]) {
        deckGames[deckKey] = 0;
        deckWins[deckKey] = 0;
      }
      deckGames[deckKey]++;
      if (match.winner === 0) {
        deckWins[deckKey]++;
      }
    });
    
    const stats = Object.keys(deckGames).map(deck => {
      const winRate = deckWins[deck] / deckGames[deck];
      return {
        deck: deck.split('-').map(Number),
        games: deckGames[deck],
        wins: deckWins[deck],
        winRate: winRate
      };
    }).sort((a, b) => b.winRate - a.winRate);
    
    return stats;
  };

  // Get card details by ID
  const getCardById = (id) => {
    return cards.find(card => card.id === id) || { name: `Unknown Card (ID: ${id})` };
  };

  // Handle new card form changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setNewCard({
      ...newCard,
      [name]: name === 'cost' || name === 'attack' || name === 'defense' || name === 'lore_value' 
        ? parseInt(value) || 0 
        : value
    });
  };

  // Add ability to new card
  const handleAddAbility = () => {
    if (abilityInput.trim()) {
      setNewCard({
        ...newCard,
        abilities: [...newCard.abilities, abilityInput.trim()]
      });
      setAbilityInput('');
    }
  };

  // Remove ability from new card
  const handleRemoveAbility = (index) => {
    const updatedAbilities = [...newCard.abilities];
    updatedAbilities.splice(index, 1);
    setNewCard({
      ...newCard,
      abilities: updatedAbilities
    });
  };

  // Submit new card
  const handleSubmitCard = (e) => {
    e.preventDefault();
    const newCardWithId = {
      ...newCard,
      id: Math.max(...cards.map(card => card.id), 0) + 1
    };
    
    const updatedCards = [...cards, newCardWithId];
    setCards(updatedCards);
    saveData('cards', updatedCards);
    
    setNewCard({
      name: '',
      cost: 0,
      attack: 0,
      defense: 0,
      abilities: [],
      lore_value: 0,
      song_effect: ''
    });
    setUploadStatus('Card uploaded successfully!');
    setTimeout(() => setUploadStatus(''), 3000);
  };

  // Handle file upload for importing decks
  const handleDeckUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const deckData = JSON.parse(event.target.result);
          // Validate deck data structure
          if (Array.isArray(deckData.deck) && typeof deckData.predicted_win_rate === 'number') {
            const updatedPredictedDecks = [...predictedDecks, deckData];
            setPredictedDecks(updatedPredictedDecks);
            saveData('predicted_decks', updatedPredictedDecks);
            setUploadStatus('Deck uploaded successfully!');
          } else {
            setUploadStatus('Invalid deck data format.');
          }
          setTimeout(() => setUploadStatus(''), 3000);
        } catch (error) {
          setUploadStatus('Error parsing deck file. Please check the format.');
          setTimeout(() => setUploadStatus(''), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Card Game Dashboard</h1>
          <p className="text-blue-200">Analyze your matches, view top decks, and get AI recommendations</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex mb-6">
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('stats')}
          >
            Match Statistics
          </button>
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'decks' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('decks')}
          >
            Best Decks
          </button>
          <button 
            className={`px-4 py-2 mr-2 ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Recommendations
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
        </div>

        {activeTab === 'stats' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Match Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Total Matches</h3>
                <p className="text-3xl font-bold">{matchHistory.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Win Rate</h3>
                <p className="text-3xl font-bold">
                  {matchHistory.length > 0 
                    ? `${((matchHistory.filter(match => match.winner === 0).length / matchHistory.length) * 100).toFixed(1)}%`
                    : '0%'}
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Recent Matches</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Deck</th>
                    <th className="py-2 px-4 text-left">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {matchHistory.slice(0, 5).map((match, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">
                        {match.deck.slice(0, 3).map(cardId => (
                          <span key={cardId} className="inline-block bg-blue-100 rounded px-2 py-1 text-sm mr-1 mb-1">
                            {getCardById(cardId).name}
                          </span>
                        ))}
                        {match.deck.length > 3 && <span className="text-gray-500 text-sm">+{match.deck.length - 3} more</span>}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded ${match.winner === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {match.winner === 0 ? 'Win' : 'Loss'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'decks' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Best Performing Decks</h2>
            
            {calculateDeckStats().length > 0 ? (
              <div className="space-y-6">
                {calculateDeckStats().slice(0, 3).map((deck, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Deck #{index + 1}</h3>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {(deck.winRate * 100).toFixed(1)}% Win Rate ({deck.wins}/{deck.games})
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap">
                      {deck.deck.slice(0, 10).map(cardId => (
                        <div key={cardId} className="bg-white border rounded-md p-2 m-1 shadow-sm">
                          <div className="h-24 w-16 bg-gray-200 rounded flex items-center justify-center mb-1">
                            <img 
                              src={`https://dreamborn.ink/cards/${cardId}`} 
                              alt={getCardById(cardId).name}
                              className="max-h-full max-w-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/placeholder/64/96";
                              }}
                            />
                          </div>
                          <div className="text-xs text-center font-medium">{getCardById(cardId).name}</div>
                        </div>
                      ))}
                      {deck.deck.length > 10 && (
                        <div className="flex items-center justify-center p-2 m-1">
                          <span className="text-gray-500">+{deck.deck.length - 10} more</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No deck statistics available yet.</p>
            )}
          </div>
        )}

        {/* The rest of the component remains the same... */}
      </div>
    </div>
  );
};

export default Dashboard;