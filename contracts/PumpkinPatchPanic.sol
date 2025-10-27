// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PumpkinPatchPanic {
    // Struct to store player data
    struct Player {
        uint256 score; // Points from collecting pumpkins
        uint256 pumpkinCount; // Number of pumpkins collected
        bool isRegistered; // Tracks if player is registered
    }

    // Struct for leaderboard entry
    struct LeaderboardEntry {
        address player;
        uint256 score;
    }

    // Mapping of player address to their data
    mapping(address => Player) public players;
    
    // Array to store leaderboard
    LeaderboardEntry[] public leaderboard;

    // Event for score updates
    event ScoreUpdated(address indexed player, uint256 score);
    event PumpkinCollected(address indexed player, uint256 pumpkinId);
    event GhostEncounter(address indexed player, uint256 scoreDeducted);

    // Owner of the contract
    address public owner;

    // Constructor to set the contract deployer as owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict functions to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Register a player
    function registerPlayer() external {
        require(!players[msg.sender].isRegistered, "Player already registered");
        players[msg.sender] = Player(0, 0, true);
    }

    // Collect a pumpkin (increases score and pumpkin count)
    function collectPumpkin(uint256 pumpkinId) external {
        require(players[msg.sender].isRegistered, "Player not registered");
        players[msg.sender].score += 10; // 10 points per pumpkin
        players[msg.sender].pumpkinCount += 1;
        updateLeaderboard(msg.sender, players[msg.sender].score);
        emit PumpkinCollected(msg.sender, pumpkinId);
        emit ScoreUpdated(msg.sender, players[msg.sender].score);
    }

    // Encounter a ghost (deducts points)
    function encounterGhost(uint256 deduction) external {
        require(players[msg.sender].isRegistered, "Player not registered");
        uint256 newScore = players[msg.sender].score > deduction 
            ? players[msg.sender].score - deduction 
            : 0;
        players[msg.sender].score = newScore;
        updateLeaderboard(msg.sender, newScore);
        emit GhostEncounter(msg.sender, deduction);
        emit ScoreUpdated(msg.sender, newScore);
    }

    // Update leaderboard
    function updateLeaderboard(address player, uint256 score) internal {
        // Remove existing entry for player
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].player == player) {
                leaderboard[i] = leaderboard[leaderboard.length - 1];
                leaderboard.pop();
                break;
            }
        }
        // Add new entry
        leaderboard.push(LeaderboardEntry(player, score));
        // Sort leaderboard (simple bubble sort for small lists)
        for (uint256 i = 0; i < leaderboard.length; i++) {
            for (uint256 j = i + 1; j < leaderboard.length; j++) {
                if (leaderboard[i].score < leaderboard[j].score) {
                    LeaderboardEntry memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }
        // Keep only top 10
        if (leaderboard.length > 10) {
            leaderboard.pop();
        }
    }

    // Get player's data
    function getPlayerData(address player) external view returns (uint256 score, uint256 pumpkinCount) {
        return (players[player].score, players[player].pumpkinCount);
    }

    // Get leaderboard
    function getLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return leaderboard;
    }

    // Owner can reset leaderboard (optional for event management)
    function resetLeaderboard() external onlyOwner {
        delete leaderboard;
    }
}