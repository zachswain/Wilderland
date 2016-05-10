var GameState = {};

GameState.NO_STATE = null;
GameState.ENTERING_SECTOR = "entering_sector";
GameState.LEAVING_SECTOR = "leaving_sector";
GameState.IN_SPACE = "in_space";
GameState.MOVING = "moving";

GameState.ENTERING_PORT = "entering_port";
GameState.IN_PORT = "in_port";
GameState.BUYING_COMMODITY = "buying_commodity";
GameState.SELLING_COMMODITY = "selling_commodity";
GameState.LEAVING_PORT = "leaving_port";

GameState.STATES = [
  GameState.NO_STATE,
  GameState.ENTERING_SECTOR,
  GameState.LEAVING_SECTOR,
  GameState.IN_SPACE,
  GameState.MOVING,
  
  GameState.ENTERING_PORT,
  GameState.IN_PORT,
  GameState.BUYING_ORE,
  GameState.LEAVING_PORT
];

module.exports = GameState;