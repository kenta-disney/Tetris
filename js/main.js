/*--------------------------------------------------------------------------------*/

//盗用厳禁

/*--------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/

//共通の変数

/*----------------------------------------------------------------------------------------------------*/

//テトリミノ
const TETRIMINO_SIZE = 24;//1ブロックのサイズ(幅)
const TETRIMINO_WIDTH = 4;//テトリミノの横幅
const TETRIMINO_HEIGHT = 4;//テトリミノの縦幅
const TETRIMINO_KINDS = 7;//テトリミノの種類数
const TETRIMINO_ANGLES = 4;//テトリミノの角度数
const TETRIMINO_NEXTKINDS = 6;//ネクストテトリミノの表示数
const TETRIMINO_INITIAL_POSITION_X = 4;//初期落下位置のX座標
const TETRIMINO_INITIAL_POSITION_Y = 4;//初期落下位置のY座標
const TETRIMINO_INITIAL_ANGLE = 0;//初期角度
const TETRIMINO_GARBAGES = 20;//お邪魔ブロックの表示数

//表示幅
const FIELD_HEIGHT = 22;//フィールドの縦幅
const FIELD_WIDTH = 12;//フィールドの横幅
const FIELD_HEIGHT_REAL = 25;//内部的なフィールドの縦幅

const FIELD_LEFT_WIDTH = TETRIMINO_SIZE * 6;//左の表示の幅
const FIELD_RIGHT_WIDTH = TETRIMINO_SIZE * 6;//右の表示の幅
const FIELD_UP_HEIGHT = TETRIMINO_SIZE * 1;//上の表示の幅
const FIELD_DOWN_HEIGHT = TETRIMINO_SIZE * 2;//下の表示の幅
const FIELD_TIME_HEIGHT = TETRIMINO_SIZE * 3;//時間の表示の幅

const SCREEN_WIDTH = TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + FIELD_RIGHT_WIDTH;//キャンバスの横幅
const SCREEN_HEIGHT_GAME = TETRIMINO_SIZE * FIELD_HEIGHT +  FIELD_UP_HEIGHT +  FIELD_DOWN_HEIGHT;//ゲーム中のキャンバスの縦幅(時間表示幅を除く)
const SCREEN_HEIGHT_OTHER = SCREEN_HEIGHT_GAME + FIELD_TIME_HEIGHT;//ゲーム画面以外のキャンバスの縦幅

const SCREEN_DEBUG_WIDTH = 400;//デバッグウィンドウの横幅
const SCREEN_DEBUG_HEIGHT = 670;//デバッグウィンドウの縦幅

const DEBUG_MODE = 0;//デバッグモードがオフなら0、オンなら1
const DEBUG_KIND = 2;//0はAIの学習パラメータ等、1はソフトドロップの判定確認、2はタイマー

//色
const COLOR_LIGHTBLUE = "#0FF";
const COLOR_YELLOW = "#FF0";
const COLOR_PURPLE = "#800080";
const COLOR_BLUE = "#00F";
const COLOR_ORANGE = "#FF6600";
const COLOR_GREEN = "#008000";
const COLOR_RED = "#F00";

const COLOR_LIGHTBLUE_FALL = "#CCFFFF";
const COLOR_YELLOW_FALL = "#FFFF99";
const COLOR_PURPLE_FALL = "#D0B0FF";
const COLOR_BLUE_FALL = "#66CCFF";
const COLOR_ORANGE_FALL = "#FFAD90";
const COLOR_GREEN_FALL = "#93FFAD";
const COLOR_RED_FALL = "#FF6666";

const COLOR_BLACK = "#000";
const COLOR_WHITE = "#FFF";
const COLOR_BACKGROUND = "#BBBBBB";//背景色
const COLOR_GRAY_HOLD = "#777777"
const COLOR_GARBAGE = "#797979";

const COLOR_LOSE ="#6633CC";
const COLOR_DARK_ORANGE = "#FF8C00";
const COLOR_GRAY_HALFSECRETDRAW = "#666666";//隠しコマンドで使う色

//効果音
const tetrisMainBgm = new Audio("sound/tetrisMainBgm.mp3");
const tetrisAIBgm = new Audio("sound/tetrisAIBgm.mp3");
const tetrisMenuBgm = new Audio("sound/tetrisMenuBgm.mp3");
const tetriminoOneShiftAndRotate = new Audio("sound/tetriminoOneShiftAndRotate.mp3");
const tetriminoHighSpeedFall = new Audio("sound/tetriminoHighSpeedFall.mp3");
const tetriminoHold = new Audio("sound/tetriminoHold.mp3");
const eraseLine1to3 = new Audio("sound/eraseLine1to3.mp3");
const eraseLine4 = new Audio("sound/eraseLine4.mp3");
const countDown = new Audio("sound/countDown.mp3");
const tetriminoFlow = new Audio("sound/tetriminoFlow.mp3");
const gameOverBgm = new Audio("sound/gameOverBgm.mp3");
const keyboardTap = new Audio("sound/keyboardTap.mp3");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));//一定秒数待つ

//経過時間
let time = -1;//0:00:00から表示するため
let hour = 0;
let min = 0;
let min1 = 0;
let min2 = 0;
let sec = 0;
let sec1 = 0;
let sec2 = 0;

let blockType = {//フィールドのブロックの種類
	FREE: 0, WALL: 1, CONTROL_LIGHTBLUE: 2, CONTROL_YELLOW: 3, CONTROL_PURPLE: 4,
	CONTROL_BLUE: 5, CONTROL_ORANGE: 6, CONTROL_GREEN: 7, CONTROL_RED: 8, FIX_LIGHTBLUE: 9,
	FIX_YELLOW: 10, FIX_PURPLE: 11, FIX_BLUE: 12, FIX_ORANGE: 13, FIX_GREEN: 14,
	FIX_RED: 15, FALL_POSITION_LIGHTBLUE: 16,FALL_POSITION_YELLOW:17,FALL_POSITION_PURPLE: 18,
	FALL_POSITION_BLUE: 19, FALL_POSITION_ORANGE: 20,FALL_POSITION_GREEN: 21,FALL_POSITION_RED: 22,
	GARBAGE: 23
};

let drawBlockKind = {//描画の種類
	FIELD:0, NEXT: 1, HOLD: 2
};

let screenState = {//画面の状態
	TITLE: 0, COUNTDOWN: 1,PLAYING: 2, GAMEOVER: 3, QUIT: 4, FLOW: 5,
	HELP: 6, RANKING: 7, AIMENU: 8,EXITWAIT: 9
};

let currentScreenState = screenState.TITLE;//現在の状態をタイトルに設定

let soundType = {//サウンドの種類
	TETRIS_MAIN_BGM: 0, TETRIS_MENU_BGM: 1, TETRIMINO_ONESHIFT_AND_ROTATE: 2, TETRIMONO_HIGHSPEED_FALL: 3,
	TETRIMINO_HOLD: 4, ERASE_LINE_1TO3: 5, ERASE_LINE_4: 6, COUNT_DOWN: 7, TETRIMINO_FLOW: 8, GAME_OVER_BGM: 9,
	KEYBOARD_TAP: 10
};

let generateTetriminoTime = {//テトリミノ生成が初回か2回目か
	FIRST_TIME: 0, FROM_THE_SECOND_TIME: 1
};

let rotateDirection = {//右回転か左回転か
	LEFT: 0, RIGHT: 1
};

let gameResult = {//試合結果
	UNDECIDED:0, PLAYER_WIN: 1, AI_WIN: 2
};

let gameResultState = gameResult.UNDECIDED;//試合結果を不定に設定

let tetriminos = [//7種類×4方向のテトリミノ
	[
		[//I(水色)
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ]
		],
	],
	[
		[//O(黄色)
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//T(紫)
			[ 0, 4, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 4, 0, 0 ],
			[ 0, 4, 4, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 4, 0, 0 ],
			[ 4, 4, 0, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//J(青)
			[ 5, 0, 0, 0 ],
			[ 5, 5, 5, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 5, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 5, 5, 5, 0 ],
			[ 0, 0, 5, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 5, 5, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//L(オレンジ)
			[ 0, 0, 6, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 6, 6, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 6, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 6, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//S(緑)
			[ 0, 7, 7, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 7, 0, 0 ],
			[ 0, 7, 7, 0 ],
			[ 0, 0, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 7, 7, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 7, 0, 0, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[//Z(赤)
			[ 8, 8, 0, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 0, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 8, 0, 0 ],
			[ 8, 8, 0, 0 ],
			[ 8, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
];

let resetPlayField= [//フィールドをリセットする際に用いる
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let resetHoldTetrimino=[//ホールドをリセットする際に用いる
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let resetTetriminos = [//テトリミノをリセットする際に用いる
	[
		[
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ],
			[ 0, 0, 2, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ]
		],
	],
	[
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 3, 3, 0 ],
			[ 0, 3, 3, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 4, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 4, 0, 0 ],
			[ 0, 4, 4, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 4, 0, 0 ],
			[ 4, 4, 0, 0 ],
			[ 0, 4, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 5, 0, 0, 0 ],
			[ 5, 5, 5, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 5, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 5, 5, 5, 0 ],
			[ 0, 0, 5, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 5, 5, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 6, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 6, 6, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 6, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 6, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 7, 7, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 7, 0, 0 ],
			[ 0, 7, 7, 0 ],
			[ 0, 0, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 7, 7, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 7, 0, 0, 0 ],
			[ 7, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 8, 8, 0, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 0, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 8, 0, 0 ],
			[ 8, 8, 0, 0 ],
			[ 8, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
];

let elapsedTimeCountTimer;//経過時間のタイマー
let drawLoopTimer;//描画のタイマー

let soundFlag = 0;//効果音を鳴らすか

/*----------------------------------------------------------------------------------------------------*/

//プレイヤーの変数

/*----------------------------------------------------------------------------------------------------*/

let playField= [//12×25のフィールド
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let currentTetrimino=[//操作中のテトリミノ
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let currentNextTetriminos=[//ネクストテトリミノ
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
];

let currentHoldTetrimino=[//ホールドテトリミノ
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let fallTime = 1000;//初期落下速度(ミリ秒)

let currentTetriminoPositionX = 0;//操作中のテトリミノのX座標
let currentTetriminoPositionY = 0;//操作中のテトリミノのY座標
let currentTetriminoAngle=0;//操作中のテトリミノの角度
let currentTetriminoKind=0;//操作中のテトリミノの種類
let currentHoldTetriminoKind = 0;//操作中のホールドテトリミノの種類
let currentGhostTetriminoPositionX = 0;//操作中のゴーストテトリミノのX座標(初期化しなくてもいい)
let currentGhostTetriminoPositionY = 0;//操作中のゴーストテトリミノのY座標(初期化しなくてもいい)

let gameScore = 0;//得点
let additionGameScore = 0;//加算される得点
let clearLineCount = 0;//消去ライン数
let gameLevel = 1;//ゲームレベル
let renCount = 0;//連鎖数
let tmpRenCount = 0;//描画している際にリセットされる可能性があるので保存する
let singleCount = 0;//1ライン消去回数
let doubleCount = 0;//2ライン消去回数
let tripleCount = 0;//3ライン消去回数
let tetrisCount = 0;//4ライン消去回数
let perfectClearCount = 0;//全消し回数
let eraseCount = 0;//一度に何ライン消去したか
let maxCombo = 0;//最大コンボ数
let tSpinCount = 0;//T-Spinの合計
let tSpinSingleCount = 0;//T-Spin Singleが行われた回数
let tSpinDoubleCount = 0;//T-Spin Doubleが行われた回数
let tSpinTripleCount = 0;//T-Spin Tripleが行われた回数
let tSpinMiniCount = 0;//T-Spin Miniの合計
let tSpinSingleMiniCount = 0;//T-Spin Single Miniの合計
let tSpinDoubleMiniCount = 0;//T-Spin Double Miniの合計
let backToBackCount = 0;//Back To Backが行われた回数
let rotateCount = 0;//テトリミノを回転した回数
let fallDistanceCount = 0;//落下(ブロック単位)の回数
let holdCount = 0;//ホールドを使用した回数

let nextTetriminoCatalog = [0,1,2,3,4,5,6];//ネクストテトリミノの出現を操作
let sortNextTetriminoCount = 0;//ネクストテトリミノのカウント
let nextTetriminoKinds = [0,0,0,0,0,0];//ネクストテトリミノの種類を格納
let holdSetFlag = 0;//ホールドが一度でも使用されたらゲームオーバーまで1
let holdChangeFlag = 0;//Holdを使用したらその間連続で交換できないようにする
let eraseLineHeightList = [-1,-1,-1,-1];//消去する行数を格納
let allClearFlag = 0;//全消し判定
let mysteriousAddPoints = 1;//謎の加算倍率
let rotateFlag = 0;//最後の操作が回転であったかどうか
let tSpinFlag = 0;//T-Spin各種の判定に用いる
let tSpinMiniFlag = 0;//T-Spin Miniの判定に用いる
let superRotationSystemKind = 0;//どのスーパーローテーションが適用されたか
let printTSpinKind = "";//T-Spinの種類を格納
let backToBackFlagCounter = 0;//Back To Backが有効か

//ソフトドロップの判定に用いる
let softDropFlag = 0;//ソフトドロップの判定中か
let softDropTimer;//ソフトドロップを定期的に判定するタイマー
let softDropCount = 0;//15回制限のカウント
let bottomTetriminoPositionY = 0;//最も下の座標を格納
let softDropOver15TimesFlag = 0;//15回以上Y座標が更新されなかったら1
let softDropFloatingFlag = 0;//ソフトドロップの判定中にテトリミノが浮いたら1

//以下6つは動くTETRISの文字を描画する(drawMoveText)際に用いる
let positionPrintHeight = 0;//フィールドに文字を表示するときの高さの位置
let movePositionW;//描画する初期位置のX座標
let movePositionH;//描画する初期位置のY座標
let stopDrawMoveTextId;//描画を止めるためのID
let moveTextFlag = 0;//最初に呼び出されたときに座標を設定するフラグ
let moveTextHeightCount = 0;//動きに緩急を持たせるために使用する

//以下3つはdrawTextで用いる
let drawTextTimeCount = 0;//表示する時間をカウントする
let printAdditionScoreAdjustment;//得点の位置を桁ごとに調整する
let stopDrawTextId;//加算得点やT-Spin等の文字の表示をキャンセルするために使用する

let mainLoopTimer;//メインループのタイマー
let softDropJudgementTimer;//ソフトドロップの判定中のタイマー

//忘備録
//全消しかどうか判定する関数はあるが、setしてからdrawする構造上、set→draw→全消し判定はできない
//かといって先に全消し判定してからset→drawしても上書きされて消されてしまう
//setの前にallClearCheckTetrimino()を実行すると全消しのカウントが加算され続けてしまう
//引数によって加算しないようにしたが、setの前にallClearCheckTetrimino(0)とするとずっと全消し判定になってしまう
//eraseCount >= 1としているのでバグは発生しないが、
//関数を使うとめんどくさくなるのでflag(allClearFlag)を用いて対処する、という経緯

//忘備録(殴り書き)2021/12/22 03:18
//マルチスレッドのデバッグは非常に困難である
//現に数百回操作して1回バグが発生するかしないかの再現不可能な未解決のバグを確認している(例えばキーボード入力(ホールド等)をすると、画面上側にブロックが固定される等)
//その原因は特定されていないが、恐らくIntervalで回しているループたちのいずれかであると推測する(又は可能性は低いが、固定判定時のsetTimeout)
//固定時のエフェクト描画の際は、各種ループの実行を行わない、そしてキーボード入力を受け付けない対策をとった方が対策をとらないよりは良いのではないかと考えた
//そこで、各種ループとキーボード入力を、固定操作、すなわちエフェクト描画時とホールドの際にフラグを用いて許可しないようにする
//これが直接バグの解決に役に立っているというのは分からない、しかしやらないよりは良い
//現にエフェクト時のバグは恐らくsoftDropJudgementLoopを許可しないようにすることで解消できた
//(ラインが揃っても消えないバグ(デバッグした結果、行数が消しているのに内部的には下にずれていないのと、固定されていたにも関わらず次のブロックを固定した際に操作中のブロックの値に謎に変化))
//よって、以下のloopLockFlagを用いて挙動を伺うこととする
let loopLockFlag = 0;//ブロック固定時、又はホールド時にループの実行を出来ないようにする

let garbageCount = 0;
let garbageFlag = 0;
let garbageHoleW = 0;
let garbagaeOdds = 0;

/*----------------------------------------------------------------------------------------------------*/

//プレイヤーのみの変数

/*----------------------------------------------------------------------------------------------------*/

let hiddenCommandTetriminos = [//特殊テトリミノ
	[
		[
			[ 2, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 2, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 2, 2, 2, 2 ],
			[ 0, 0, 0, 2 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 0, 2, 0, 0 ],
			[ 2, 2, 0, 0 ]
		],
	],
	[
		[
			[ 3, 3, 3, 0 ],
			[ 3, 3, 3, 0 ],
			[ 3, 3, 3, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 3, 3, 3, 3 ],
			[ 3, 3, 3, 3 ],
			[ 3, 3, 3, 3 ],
			[ 3, 3, 3, 3 ]
		],
		[
			[ 3, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 3, 3, 0, 0 ],
			[ 3, 3, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 4, 4, 4, 0 ],
			[ 4, 0, 0, 0 ],
			[ 4, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 4, 4, 4, 0 ],
			[ 0, 0, 4, 0 ],
			[ 0, 0, 4, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 4, 0 ],
			[ 0, 0, 4, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 4, 0, 0, 0 ],
			[ 4, 0, 0, 0 ],
			[ 4, 4, 4, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 0, 0, 5 ],
			[ 5, 5, 5, 5 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 5, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ],
			[ 5, 5, 5, 5 ],
			[ 5, 0, 0, 0 ]
		],
		[
			[ 5, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ],
			[ 0, 5, 0, 0 ]
		],
	],
	[
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 6, 0, 0 ],
			[ 6, 6, 6, 0 ],
			[ 0, 6, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 7, 7, 7, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 0, 7, 0 ],
			[ 7, 7, 7, 0 ],
			[ 0, 0, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 7, 0, 0 ],
			[ 0, 7, 0, 0 ],
			[ 7, 7, 7, 0 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 7, 0, 0, 0 ],
			[ 7, 7, 7, 0 ],
			[ 7, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
	[
		[
			[ 0, 8, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 8, 0 ],
			[ 0, 8, 8, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 8, 8 ],
			[ 8, 8, 8, 8 ],
			[ 0, 0, 0, 0 ]
		],
		[
			[ 0, 8, 0, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 8, 0, 0 ],
			[ 0, 8, 0, 0 ]
		],
		[
			[ 0, 0, 0, 0 ],
			[ 8, 8, 8, 8 ],
			[ 0, 0, 0, 0 ],
			[ 0, 0, 0, 0 ]
		],
	],
];

//隠しコマンド
let hiddenCommand_rotateDraw_Counter = 0;
let hiddenCommand_rotateDraw_Flag = 0;

let hiddenCommand_halfSecretDraw_Counter = 0;
let hiddenCommand_halfSecretDraw_Flag = 0;

let hiddenCommand_gameLevelUp_Counter = 0;
let hiddenCommand_fieldClear_Counter = 0;

let hiddenCommand_changeTetrimino_Counter = 0;
let hiddenCommand_changeTetrimino_Flag = 0;

let hiddenCommand_mysteriousAddPoints_Counter = 0;
let hiddenCommand_mysteriousAddPoints_Flag = 0;

let localStorageRankingTetris;//ローカルストレージ
let localStorageTotalAndMaxTetris;

/*----------------------------------------------------------------------------------------------------*/

//AIの変数

/*----------------------------------------------------------------------------------------------------*/

let playFieldAI= [
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let currentTetriminoAI=[
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let currentNextTetriminosAI=[
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
	[
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ]
	],
];

let currentHoldTetriminoAI=[
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let fallTimeAI = 1000;

let currentTetriminoPositionXAI = 0;
let currentTetriminoPositionYAI = 0;
let currentTetriminoAngleAI=0;
let currentTetriminoKindAI=0;
let currentHoldTetriminoKindAI = 0;
let currentGhostTetriminoPositionXAI = 0;
let currentGhostTetriminoPositionYAI = 0;

let gameScoreAI = 0;
let additionGameScoreAI = 0;
let clearLineCountAI = 0;
let gameLevelAI = 1;
let renCountAI = 0;
let tmpRenCountAI = 0;
let singleCountAI = 0;
let doubleCountAI = 0;
let tripleCountAI = 0;
let tetrisCountAI = 0;
let perfectClearCountAI = 0;
let eraseCountAI = 0;
let maxComboAI = 0;
let tSpinCountAI = 0;
let tSpinSingleCountAI = 0;
let tSpinDoubleCountAI = 0;
let tSpinTripleCountAI = 0;
let tSpinMiniCountAI = 0;
let tSpinSingleMiniCountAI = 0;
let tSpinDoubleMiniCountAI = 0;
let backToBackCountAI = 0;
let rotateCountAI = 0;
let fallDistanceCountAI = 0;
let holdCountAI = 0;

let nextTetriminoCatalogAI = [0,1,2,3,4,5,6];
let sortNextTetriminoCountAI = 0;
let nextTetriminoKindsAI = [0,0,0,0,0,0];
let holdSetFlagAI = 0;
let holdChangeFlagAI = 0;
let eraseLineHeightListAI = [-1,-1,-1,-1];
let allClearFlagAI = 0;
//let mysteriousAddPointsAI = 1;//使用しないが、プレイヤーの変数宣言と行を合わせるため記述
let rotateFlagAI = 0;
let tSpinFlagAI = 0;
let tSpinMiniFlagAI = 0;
let superRotationSystemKindAI = 0;
let printTSpinKindAI = "";
let backToBackFlagCounterAI = 0;

let softDropFlagAI = 0;
let softDropTimerAI;
let softDropCountAI = 0;
let bottomTetriminoPositionYAI = 0;
let softDropOver15TimesFlagAI = 0;
let softDropFloatingFlagAI = 0;

let positionPrintHeightAI = 0;
let movePositionWAI;
let movePositionHAI;
let stopDrawMoveTextIdAI;
let moveTextFlagAI = 0;
let moveTextHeightCountAI = 0;

let drawTextTimeCountAI = 0;
let printAdditionScoreAdjustmentAI;
let stopDrawTextIdAI;

let mainLoopTimerAI;
let softDropJudgementTimerAI;

let loopLockFlagAI = 0;

let garbageCountAI = 0;
let garbageFlagAI = 0;
let garbageHoleWAI = 0;
let garbagaeOddsAI = 0;

/*----------------------------------------------------------------------------------------------------*/

//AIのみの変数

/*----------------------------------------------------------------------------------------------------*/

const SCREEN_WIDTH_AI = SCREEN_WIDTH * 2;//AI対戦時のキャンバスの横幅
const SCREEN_WIDTH_DRAW_AI = SCREEN_WIDTH;//フィールド描画を丸々1個分ずらす、変数名は分かりやすいように変更
const SCREEN_WIDTH_TEXT_AI = SCREEN_WIDTH / 2;//AI対戦のときにタイトル画面等の文字を中央に表示する

let aiFlag = 0;//AI対戦かどうか

let aiLevel = 8;//AIの強さの初期値
let generateTetriminoSpeed;//AIのテトリミノ生成速度
let moveTetriminoSpeed;//AIのテトリミノ移動回転速度

let flashingArrowFlag = 1;//点滅状態(描画状態から表示するため1)
let flashingArrowTimer;//矢印を点滅させるためのタイマー

/*----------------------------------------------------------------------------------------------------*/

//評価関数の変数

/*----------------------------------------------------------------------------------------------------*/

const AI_LEARNING_FLAG = 0;//通常プレイなら0、NNとGAでAIに学習させるモードなら1(0ならONEGENERATIONFLAGの値はどちらでもよい)
const ONE_GENERATION_FLAG = 1;//遺伝的アルゴリズムの1世代目の作成なら1、2世代目以降なら0

let tmpEvaluationTetrimino=[
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ],
	[ 0, 0, 0, 0 ]
];

let tmpEvaluationField= [
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
	[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

let evaluationTimerAI;

let holeCountCoefficient;//-1～-100
let holeUpTetriminoCountCoefficient;//-1～-100
let holeColumnCountCoefficient;//-1～-100
let sumHeightCoefficient;//-1～-100
let maxHeightCoefficient;//-1～-100
let differenceHeightSumCoefficient;//-1～-100
let putTetriminoHeightCoefficient;//-1～-100
let rowChangeCountCoefficient;//-1～-100
let columnChangeCountCoefficient;//-1～-100
let completeLineCountCoefficient;//1～100

let playCountAI = 1;
let numberOfTrials = 1;
let sumClearLineCountAI = 0;
let maxClearLineCountAI = 0;
let minClearLineCountAI = 0;
let sumTetrisCountAI = 0;
let sumPerfectClearCountAI = 0;
let endEvaluationFlag = 0;//デバッグモードの平均が上手くできないので、最後の表示だけフラグで調整

let geneList= [//2世代目以降を作成する際に設定
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/*----------------------------------------------------------------------------------------------------*/

//canvasの変数

/*----------------------------------------------------------------------------------------------------*/

let canvasAll = null;//キャンバス取得
let allWindow = null;//コンテキスト取得

let canvasTime = null;
let timeWindow = null;

let canvasGame = null;
let gameWindow = null;

let canvasMoveTextPlayer = null;
let moveTextPlayerWindow = null;

let canvasMoveTextAI = null;
let moveTextAIWindow = null;

let canvasTextPlayer = null;
let textPlayerWindow = null;

let canvasTextAI = null;
let textAIWindow = null;

let canvasDebug = null;
let debugWindow = null;

/*----------------------------------------------------------------------------------------------------*/

//その他の関数

/*----------------------------------------------------------------------------------------------------*/

function init(){
	let url, params;

	//キャンバスの設定
	canvasAll = document.getElementById("canvasAll");
	canvasAll.height = SCREEN_HEIGHT_OTHER;
	allWindow = canvasAll.getContext("2d");

	canvasTime = document.getElementById("canvasTime");
	canvasTime.height = FIELD_TIME_HEIGHT;
	timeWindow = canvasTime.getContext("2d");

	canvasGame = document.getElementById("canvasGame");
	canvasGame.height = SCREEN_HEIGHT_GAME;
	gameWindow = canvasGame.getContext("2d");

	canvasMoveTextPlayer = document.querySelector("#canvasMoveTextPlayer");
	canvasMoveTextPlayer.height = SCREEN_HEIGHT_OTHER;
	moveTextPlayerWindow = canvasMoveTextPlayer.getContext('2d');
	
    canvasMoveTextAI = document.querySelector("#canvasMoveTextAI");
	canvasMoveTextAI.height = SCREEN_HEIGHT_OTHER;
	moveTextAIWindow = canvasMoveTextAI.getContext('2d');
    
	canvasTextPlayer = document.querySelector("#canvasTextPlayer");
	canvasTextPlayer.height = SCREEN_HEIGHT_OTHER;
	textPlayerWindow = canvasTextPlayer.getContext('2d');
	
	canvasTextAI = document.querySelector("#canvasTextAI");
	canvasTextAI.height = SCREEN_HEIGHT_OTHER;
	textAIWindow = canvasTextAI.getContext('2d');
	
    url = new URL(window.location.href);
	params = url.searchParams;

	if(params.get('type') == "AI"){
		canvasAll.width = SCREEN_WIDTH_AI;
        canvasTime.width = SCREEN_WIDTH_AI;
		canvasGame.width = SCREEN_WIDTH_AI;
		canvasMoveTextPlayer.width = SCREEN_WIDTH_AI;
        canvasMoveTextAI.width = SCREEN_WIDTH_AI;
        canvasTextPlayer.width = SCREEN_WIDTH_AI;
        canvasTextAI.width = SCREEN_WIDTH_AI;

		aiFlag = 1;
	}else{	
		canvasAll.width = SCREEN_WIDTH;
        canvasTime.width = SCREEN_WIDTH;
		canvasGame.width = SCREEN_WIDTH;
		canvasMoveTextPlayer.width = SCREEN_WIDTH;
		canvasTextPlayer.width = SCREEN_WIDTH;
	}

	canvasDebug = document.getElementById("canvasDebug");
	canvasDebug.width = SCREEN_DEBUG_WIDTH;
	canvasDebug.height = SCREEN_DEBUG_HEIGHT;
	debugWindow = canvasDebug.getContext('2d');

	//ローカルストレージをクリア
	//localStorage.clear();

	localStorageRankingTetris = JSON.parse(localStorage.getItem('localStorageRankingTetris'));

	//alert(localStorageRankingTetris);
	
	if(localStorageRankingTetris == null){
		localStorageRankingTetris = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];

		localStorageTotalAndMaxTetris = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];

		localStorage.setItem('localStorageRankingTetris', JSON.stringify(localStorageRankingTetris));
		localStorage.setItem('localStorageTotalAndMaxTetris', JSON.stringify(localStorageTotalAndMaxTetris));
	}

	if(aiFlag == 1){
		if(AI_LEARNING_FLAG == 1){
			if(ONE_GENERATION_FLAG == 1){
				holeCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				holeUpTetriminoCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				holeColumnCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				sumHeightCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				maxHeightCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				differenceHeightSumCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				putTetriminoHeightCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				rowChangeCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				columnChangeCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
				completeLineCountCoefficient = (Math.round(Math.random() * 10000) / 100);
			}else if(ONE_GENERATION_FLAG == 0){
				holeCountCoefficient = geneList[0][0];
				holeUpTetriminoCountCoefficient = geneList[0][1];
				holeColumnCountCoefficient = geneList[0][2];
				sumHeightCoefficient = geneList[0][3];
				maxHeightCoefficient = geneList[0][4];
				differenceHeightSumCoefficient = geneList[0][5];
				putTetriminoHeightCoefficient = geneList[0][6];
				rowChangeCountCoefficient = geneList[0][7];
				columnChangeCountCoefficient = geneList[0][8];
				completeLineCountCoefficient = geneList[0][9];
			}
		}else if(AI_LEARNING_FLAG == 0){
			holeCountCoefficient = -32.49;
			holeUpTetriminoCountCoefficient = -62.87;
			holeColumnCountCoefficient = -82.11;
			sumHeightCoefficient = -12.87;
			maxHeightCoefficient = -42.55;
			differenceHeightSumCoefficient = -30.03;
			putTetriminoHeightCoefficient = -19.16;
			rowChangeCountCoefficient = -19.15;
			columnChangeCountCoefficient = -78.97;
			completeLineCountCoefficient = 81.9;
		}
	}
}

function fieldClear(){
	let h,w;
    for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
            playField[h][w] = resetPlayField[h][w];
        }
    }
}

function variableReset(){//変数の定義と順番を揃える
    let h,w;

    //共通の変数
    time = -1;
	hour = 0;
	min = 0;
	min1 = 0;
	min2 = 0;
	sec = 0;
	sec1 = 0;
	sec2 = 0;

    gameResultState = gameResult.UNDECIDED;

    //特殊なテトリミノを戻す
	for (i = 0; i < TETRIMINO_KINDS; i++) {
        for (j = 0; j < TETRIMINO_ANGLES; j++) {
            for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					tetriminos[i][j][h][w] = resetTetriminos[i][j][h][w];
				}
			}
		}
    }
	
	//プレイヤーの変数
	for (h = 0; h < FIELD_HEIGHT_REAL; h++) {
        for (w = 0; w < FIELD_WIDTH; w++) {
            playField[h][w] = resetPlayField[h][w];
        }
    }

    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            currentHoldTetrimino[h][w] = resetHoldTetrimino[h][w];
        }
    }

	fallTime = 1000;

	currentTetriminoPositionX = 0;
    currentTetriminoPositionY = 0;
	currentTetriminoAngle=0;
    currentTetriminoKind=0;
	currentHoldTetriminoKind = 0;
	currentGhostTetriminoPositionX = 0;//初期化しなくてもいい
	currentGhostTetriminoPositionY = 0;//初期化しなくてもいい

    gameScore = 0;
	additionGameScore = 0;
    clearLineCount = 0;
    gameLevel = 1;
	renCount = 0;
	tmpRenCount = 0;
	singleCount = 0;
	doubleCount = 0;
	tripleCount = 0;
    tetrisCount = 0;
	perfectClearCount = 0;
	eraseCount = 0;
	maxCombo = 0;
	tSpinCount = 0;
	tSpinSingleCount = 0;
	tSpinDoubleCount = 0;
	tSpinTripleCount = 0;
	tSpinMiniCount = 0;
	tSpinSingleMiniCount = 0;
	tSpinDoubleMiniCount = 0;
	backToBackCount = 0;
	rotateCount = 0;
	fallDistanceCount = 0;
	holdCount = 0;

	nextTetriminoCatalog = [0,1,2,3,4,5,6];
	sortNextTetriminoCount = 0;
	nextTetriminoKinds = [0,0,0,0,0,0];
    holdSetFlag = 0;
    holdChangeFlag = 0;
	eraseLineHeightList = [-1,-1,-1,-1];
	allClearFlag = 0;
	mysteriousAddPoints = 1;
	rotateFlag = 0;
	tSpinFlag = 0;
	tSpinMiniFlag = 0;
	superRotationSystemKind = 0;
	printTSpinKind = "";
	backToBackFlagCounter = 0;

	softDropFlag = 0;
	softDropCount = 0;
	bottomTetriminoPositionY = 0;
	softDropOver15TimesFlag = 0;
    softDropFloatingFlag = 0;

	positionPrintHeight = 0;
	moveTextFlag = 0;
	moveTextHeightCount = 0;

	drawTextTimeCount = 0;

	loopLockFlag = 0;

	garbageCount = 0;
	garbageFlag = 0;
	garbageHoleW = 0;
	garbagaeOdds = 0;

    //プレイヤーのみの変数
	hiddenCommand_rotateDraw_Counter = 0;
	hiddenCommand_rotateDraw_Flag = 0;
	hiddenCommand_halfSecretDraw_Counter = 0;
	hiddenCommand_halfSecretDraw_Flag = 0;
	hiddenCommand_gameLevelUp_Counter = 0;
	hiddenCommand_fieldClear_Counter = 0;
	hiddenCommand_changeTetrimino_Counter = 0;
	hiddenCommand_changeTetrimino_Flag = 0;
	hiddenCommand_mysteriousAddPoints_Counter = 0;
	hiddenCommand_mysteriousAddPoints_Flag = 0;

	//AIの変数
	for (h = 0; h < FIELD_HEIGHT_REAL; h++) {
		for (w = 0; w < FIELD_WIDTH; w++) {
			playFieldAI[h][w] = resetPlayField[h][w];
		}
	}

	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			currentHoldTetriminoAI[h][w] = resetHoldTetrimino[h][w];
		}
	}

	fallTimeAI = 1000;

	currentTetriminoPositionXAI = 0;
    currentTetriminoPositionYAI = 0;
	currentTetriminoAngleAI=0;
    currentTetriminoKindAI=0;
	currentHoldTetriminoKindAI = 0;
	currentGhostTetriminoPositionXAI = 0;
	currentGhostTetriminoPositionYAI = 0;

    gameScoreAI = 0;
	additionGameScoreAI = 0;
    clearLineCountAI = 0;
    gameLevelAI = 1;
	renCountAI = 0;
	tmpRenCountAI = 0;
	singleCountAI = 0;
	doubleCountAI = 0;
	tripleCountAI = 0;
    tetrisCountAI = 0;
	perfectClearCountAI = 0;
	eraseCountAI = 0;
	maxComboAI = 0;
	tSpinCountAI = 0;
	tSpinSingleCountAI = 0;
	tSpinDoubleCountAI = 0;
	tSpinTripleCountAI = 0;
	tSpinMiniCountAI = 0;
	tSpinSingleMiniCountAI = 0;
	tSpinDoubleMiniCountAI = 0;
	backToBackCountAI = 0;
	rotateCountAI = 0;
	fallDistanceCountAI = 0;
	holdCountAI = 0;

	nextTetriminoCatalogAI = [0,1,2,3,4,5,6];
	sortNextTetriminoCountAI = 0;
	nextTetriminoKindsAI = [0,0,0,0,0,0];
    holdSetFlagAI = 0;
    holdChangeFlagAI = 0;
	eraseLineHeightListAI = [-1,-1,-1,-1];
	allClearFlagAI = 0;
	//mysteriousAddPointsAI = 1;//使用しないが、プレイヤーの変数宣言と行を合わせるため記述
	rotateFlagAI = 0;
	tSpinFlagAI = 0;
	tSpinMiniFlagAI = 0;
	superRotationSystemKindAI = 0;
	printTSpinKindAI = "";
	backToBackFlagCounterAI = 0;

	softDropFlagAI = 0;
	softDropCountAI = 0;
	bottomTetriminoPositionYAI = 0;
    softDropOver15TimesFlagAI = 0;
	softDropFloatingFlagAI = 0;

	positionPrintHeightAI = 0;
	moveTextFlagAI = 0;
	moveTextHeightCountAI = 0;

	drawTextTimeCountAI = 0;

	loopLockFlagAI = 0;

	garbageCountAI = 0;
	garbageFlagAI = 0;
	garbageHoleWAI = 0;
	garbagaeOddsAI = 0;
}

function changeHiddenTetrimino(){
	let i,j,h,w;
	for (i = 0; i < TETRIMINO_KINDS; i++) {
        for (j = 0; j < TETRIMINO_ANGLES; j++) {
            for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					tetriminos[i][j][h][w] = hiddenCommandTetriminos[i][j][h][w];
				}
			}
		}
    }
}

function compareGameScore(a,b){
	return b[0] - a[0];
}

function updateRanking(){
	let date = new Date();
	let week = ["日","月","火","水","木","金","土"];

	localStorageRankingTetris = JSON.parse(localStorage.getItem('localStorageRankingTetris'));
	localStorageTotalAndMaxTetris = JSON.parse(localStorage.getItem('localStorageTotalAndMaxTetris'));
    
	if(gameScore != 0){
		localStorageRankingTetris[100][0] = gameScore;
		localStorageRankingTetris[100][1] = date.getFullYear() + "/" + ('00'+(date.getMonth() + 1)).slice(-2) + "/" + ('00'+date.getDate()).slice(-2) + "(" + week[date.getDay()] + ")" + ('00'+date.getHours()).slice(-2) + ":" + ('00'+date.getMinutes()).slice(-2);
		localStorageRankingTetris[100][2] = String(min1) + String(min2) + "分" + String(sec1) + String(sec2) + "秒";
		localStorageRankingTetris[100][3] = clearLineCount;
		localStorageRankingTetris[100][4] = gameLevel;
		localStorageRankingTetris[100][5] = maxCombo;
		localStorageRankingTetris[100][6] = singleCount;
		localStorageRankingTetris[100][7] = doubleCount;
		localStorageRankingTetris[100][8] = tripleCount;
		localStorageRankingTetris[100][9] = tetrisCount;
		localStorageRankingTetris[100][10] = perfectClearCount;
		localStorageRankingTetris[100][11] = tSpinSingleMiniCount;
		localStorageRankingTetris[100][12] = tSpinDoubleMiniCount;
		localStorageRankingTetris[100][13] = tSpinMiniCount;
		localStorageRankingTetris[100][14] = tSpinSingleCount;
		localStorageRankingTetris[100][15] = tSpinDoubleCount;
		localStorageRankingTetris[100][16] = tSpinTripleCount;
		localStorageRankingTetris[100][17] = tSpinCount;
		localStorageRankingTetris[100][18] = backToBackCount;
		localStorageRankingTetris[100][19] = rotateCount;
		localStorageRankingTetris[100][20] = fallDistanceCount;
		localStorageRankingTetris[100][21] = holdCount;

		//ランキングを降順にソート
		localStorageRankingTetris.sort(compareGameScore);
		localStorage.setItem('localStorageRankingTetris', JSON.stringify(localStorageRankingTetris));

		localStorageTotalAndMaxTetris[0][0] += gameScore;
		localStorageTotalAndMaxTetris[0][1] += 1;//プレイ回数
		localStorageTotalAndMaxTetris[0][2] += time;
		localStorageTotalAndMaxTetris[0][3] += clearLineCount;
		localStorageTotalAndMaxTetris[0][4] += gameLevel;
		localStorageTotalAndMaxTetris[0][5] = 0;//この項目は無いが他の配列と揃えるため0を格納
		localStorageTotalAndMaxTetris[0][6] += singleCount;
		localStorageTotalAndMaxTetris[0][7] += doubleCount;
		localStorageTotalAndMaxTetris[0][8] += tripleCount;
		localStorageTotalAndMaxTetris[0][9] += tetrisCount;
		localStorageTotalAndMaxTetris[0][10] += perfectClearCount;
		localStorageTotalAndMaxTetris[0][11] += tSpinSingleMiniCount;
		localStorageTotalAndMaxTetris[0][12] += tSpinDoubleMiniCount;
		localStorageTotalAndMaxTetris[0][13] += tSpinMiniCount;
		localStorageTotalAndMaxTetris[0][14] += tSpinSingleCount;
		localStorageTotalAndMaxTetris[0][15] += tSpinDoubleCount;
		localStorageTotalAndMaxTetris[0][16] += tSpinTripleCount;
		localStorageTotalAndMaxTetris[0][17] += tSpinCount;
		localStorageTotalAndMaxTetris[0][18] += backToBackCount;
		localStorageTotalAndMaxTetris[0][19] += rotateCount;
		localStorageTotalAndMaxTetris[0][20] += fallDistanceCount;
		localStorageTotalAndMaxTetris[0][21] += holdCount;

		if(localStorageTotalAndMaxTetris[1][0] < gameScore){
			localStorageTotalAndMaxTetris[1][0] = gameScore;
		}

		localStorageTotalAndMaxTetris[1][1] = 0;//この項目は無いが他の配列と揃えるため0を格納
		
		if(localStorageTotalAndMaxTetris[1][2] < time){
			localStorageTotalAndMaxTetris[1][2] = time;
		}
		if(localStorageTotalAndMaxTetris[1][3] < clearLineCount){
			localStorageTotalAndMaxTetris[1][3] = clearLineCount;
		}
		
		if(localStorageTotalAndMaxTetris[1][4] < gameLevel){
			localStorageTotalAndMaxTetris[1][4] = gameLevel;
		}
		
		if(localStorageTotalAndMaxTetris[1][5] < maxCombo){
			localStorageTotalAndMaxTetris[1][5] = maxCombo;
		}

		if(localStorageTotalAndMaxTetris[1][6] < singleCount){
			localStorageTotalAndMaxTetris[1][6] = singleCount;
		}

		if(localStorageTotalAndMaxTetris[1][7] < doubleCount){
			localStorageTotalAndMaxTetris[1][7] = doubleCount;
		}

		if(localStorageTotalAndMaxTetris[1][8] < tripleCount){
			localStorageTotalAndMaxTetris[1][8] = tripleCount;
		}

		if(localStorageTotalAndMaxTetris[1][9] < tetrisCount){
			localStorageTotalAndMaxTetris[1][9] = tetrisCount;
		}

		if(localStorageTotalAndMaxTetris[1][10] < perfectClearCount){
			localStorageTotalAndMaxTetris[1][10] = perfectClearCount;
		}
		
		if(localStorageTotalAndMaxTetris[1][11] < tSpinSingleMiniCount){
			localStorageTotalAndMaxTetris[1][11] = tSpinSingleMiniCount;
		}
		
		if(localStorageTotalAndMaxTetris[1][12] < tSpinDoubleMiniCount){
			localStorageTotalAndMaxTetris[1][12] = tSpinDoubleMiniCount;
		}

		if(localStorageTotalAndMaxTetris[1][13] < tSpinMiniCount){
			localStorageTotalAndMaxTetris[1][13] = tSpinMiniCount;
		}

		if(localStorageTotalAndMaxTetris[1][14] < tSpinSingleCount){
			localStorageTotalAndMaxTetris[1][14] = tSpinSingleCount;
		}

		if(localStorageTotalAndMaxTetris[1][15] < tSpinDoubleCount){
			localStorageTotalAndMaxTetris[1][15] = tSpinDoubleCount;
		}
		
		if(localStorageTotalAndMaxTetris[1][16] < tSpinTripleCount){
			localStorageTotalAndMaxTetris[1][16] = tSpinTripleCount;
		}
		
		if(localStorageTotalAndMaxTetris[1][17] < tSpinCount){
			localStorageTotalAndMaxTetris[1][17] = tSpinCount;
		}
		
		if(localStorageTotalAndMaxTetris[1][18] < backToBackCount){
			localStorageTotalAndMaxTetris[1][18] = backToBackCount;
		}

		if(localStorageTotalAndMaxTetris[1][19] < rotateCount){
			localStorageTotalAndMaxTetris[1][19] = rotateCount;
		}

		if(localStorageTotalAndMaxTetris[1][20] < fallDistanceCount){
			localStorageTotalAndMaxTetris[1][20] = fallDistanceCount;
		}

		if(localStorageTotalAndMaxTetris[1][21] < holdCount){
			localStorageTotalAndMaxTetris[1][21] = holdCount;
		}

		localStorage.setItem('localStorageTotalAndMaxTetris', JSON.stringify(localStorageTotalAndMaxTetris));
	}
}

function aiLevelSetting(){
    switch(aiLevel){
        case 1:
            generateTetriminoSpeed = 1000;
            moveTetriminoSpeed = 300;
            break;
        case 2:
            generateTetriminoSpeed = 800;
            moveTetriminoSpeed = 250;
            break;
        case 3:
            generateTetriminoSpeed = 600;
            moveTetriminoSpeed = 200;
            break;
        case 4:
            generateTetriminoSpeed = 400;
            moveTetriminoSpeed = 150;
            break;
        case 5:
            generateTetriminoSpeed = 200;
            moveTetriminoSpeed = 100;
            break;
        case 6:
            generateTetriminoSpeed = 100;
            moveTetriminoSpeed = 80;
            break;
        case 7:
            generateTetriminoSpeed = 80;
            moveTetriminoSpeed = 80;
            break;
        case 8:
            generateTetriminoSpeed = 60;
            moveTetriminoSpeed = 60;
            break;
        case 9:
            generateTetriminoSpeed = 40;
            moveTetriminoSpeed = 40;
            break;
        case 10:
            generateTetriminoSpeed = 20;
            moveTetriminoSpeed = 20;
            break;
    }
}

/*----------------------------------------------------------------------------------------------------*/

//描画を消去する関数

/*----------------------------------------------------------------------------------------------------*/

function clearAllWindow(){
	allWindow.fillStyle = COLOR_BACKGROUND;//背景色
	allWindow.fillRect(0, 0, canvasAll.width, canvasAll.height);
    //allWindow.rect(0, 0, SCREEN_WIDTH_AI, SCREEN_HEIGHT_OTHER);
    //allWindow.lineWidth = 4;
    //allWindow.stroke();
}

function clearTimeWindow(){
	timeWindow.fillStyle = COLOR_BACKGROUND;
	timeWindow.fillRect(0, 0, canvasTime.width, canvasTime.height);

}

function clearGameWindow(){
	gameWindow.fillStyle = COLOR_BACKGROUND;
	gameWindow.fillRect(0, 0, canvasGame.width, canvasGame.height);
}

function clearMoveTextPlayerWindow(){
	moveTextPlayerWindow.clearRect(0, 0, canvasMoveTextPlayer.width, canvasMoveTextPlayer.height);
}

function clearMoveTextAIWindow(){
    moveTextAIWindow.clearRect(0, 0, canvasMoveTextAI.width, canvasMoveTextAI.height);
}

function clearTextPlayerWindow(){
	textPlayerWindow.clearRect(0, 0, canvasTextPlayer.width, canvasTextPlayer.height);
}

function clearTextAIWindow(){
	textAIWindow.clearRect(0, 0, canvasTextAI.width, canvasTextAI.height);
}

function clearDebugWindow(){
	debugWindow.fillStyle = COLOR_WHITE;
	debugWindow.fillRect(0, 0, SCREEN_DEBUG_WIDTH, SCREEN_DEBUG_HEIGHT);
	debugWindow.rect(0, 0, SCREEN_DEBUG_WIDTH, SCREEN_DEBUG_HEIGHT);
	debugWindow.lineWidth = 1;
	debugWindow.stroke();
}

function stopAllTimerAnimationFrame(){
    clearInterval(mainLoopTimer);
    clearInterval(drawLoopTimer);
    clearInterval(elapsedTimeCountTimer);
    clearInterval(softDropJudgementTimer);
    clearTimeout(softDropTimer);//これを書かないとゲームオーバーの段々消えていく描画の時にKを連打したらテトリミノが描画されてバグが発生する
    if(aiFlag == 1){
        clearInterval(mainLoopTimerAI);
        clearTimeout(softDropTimerAI);
        clearInterval(evaluationTimerAI);
    }

    window.cancelAnimationFrame(stopDrawTextId);//これを書かないとリザルト画面で得点等が表示されてしまう
    clearTextPlayerWindow();
    window.cancelAnimationFrame(stopDrawTextIdAI);
    clearTextAIWindow();
    window.cancelAnimationFrame(stopDrawMoveTextId);
    clearMoveTextPlayerWindow();
    window.cancelAnimationFrame(stopDrawMoveTextIdAI);
    clearMoveTextAIWindow();
}
/*----------------------------------------------------------------------------------------------------*/

//テトリミノを生成する関数

/*----------------------------------------------------------------------------------------------------*/

function setNewControlTetrimino(kind) {
    let i,h,w;
    
	//ネクストテトリミノの先頭を操作中のテトリミノにセット
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            currentTetrimino[h][w] = currentNextTetriminos[0][h][w];
        }
    }
    //ネクストテトリミノをずらす
    for (i = 1; i < TETRIMINO_NEXTKINDS; i++) {
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                currentNextTetriminos[i-1][h][w] = currentNextTetriminos[i][h][w];
            }
        }
    }
	//選ばれたテトリミノをネクストテトリミノの末尾にセット
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            currentNextTetriminos[TETRIMINO_NEXTKINDS-1][h][w] = tetriminos[kind][currentTetriminoAngle][h][w];
        }
    }
    
	//テトリミノの種類も同様にずらす
    currentTetriminoKind = nextTetriminoKinds[0];
    for(i = 1;i < TETRIMINO_NEXTKINDS; i++){
        nextTetriminoKinds[i-1] = nextTetriminoKinds[i];
    }
    nextTetriminoKinds[TETRIMINO_NEXTKINDS - 1] = kind;
}

function setNewControlTetriminoAI(kind) {
    let i,h,w;
    
	//ネクストテトリミノの先頭を操作中のテトリミノにセット
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			currentTetriminoAI[h][w] = currentNextTetriminosAI[0][h][w];
		}
	}
	//ネクストテトリミノをずらす
	for (i = 1; i < TETRIMINO_NEXTKINDS; i++) {
		for (h = 0; h < TETRIMINO_HEIGHT; h++) {
			for (w = 0; w < TETRIMINO_WIDTH; w++) {
				currentNextTetriminosAI[i-1][h][w] = currentNextTetriminosAI[i][h][w];
			}
		}
	}
	//選ばれたテトリミノをネクストテトリミノの末尾にセット
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			currentNextTetriminosAI[TETRIMINO_NEXTKINDS-1][h][w] = tetriminos[kind][currentTetriminoAngleAI][h][w];
		}
	}
	
	//テトリミノの種類も同様にずらす
	currentTetriminoKindAI = nextTetriminoKindsAI[0];
	for(i = 1;i < TETRIMINO_NEXTKINDS; i++){
		nextTetriminoKindsAI[i-1] = nextTetriminoKindsAI[i];
	}
	nextTetriminoKindsAI[TETRIMINO_NEXTKINDS - 1] = kind;
}

function shuffleNextTetrimino(array){
    let i,j,tmp;

    for(i = 0;i < TETRIMINO_KINDS; i++){
        j = Math.floor(Math.random()*7);
        tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

function shuffleNextTetriminoAI(array){
    let i,j,tmp;

    for(i = 0;i < TETRIMINO_KINDS; i++){
        j = Math.floor(Math.random()*7);
        tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

function generateTetrimino(howManyTimes){
    let i;

    currentTetriminoAngle = TETRIMINO_INITIAL_ANGLE;
    currentTetriminoPositionX = TETRIMINO_INITIAL_POSITION_X;
    currentTetriminoPositionY = TETRIMINO_INITIAL_POSITION_Y;
    bottomTetriminoPositionY = currentTetriminoPositionY;
    
	//ゲーム開始時の初回のネクストテトリミノ生成(6回余分に生成)
    if(howManyTimes == generateTetriminoTime.FIRST_TIME){
		//ネクストテトリミノをランダムに並び替えする
        shuffleNextTetrimino(nextTetriminoCatalog);
        for(i = 0;i < TETRIMINO_NEXTKINDS; i++){
            currentTetriminoKind = nextTetriminoCatalog[sortNextTetriminoCount];
            sortNextTetriminoCount++;
            setNewControlTetrimino(currentTetriminoKind);
        }
        return;
    }

	//一通り(7種類)生成したら、再び生成の順番をランダムに並び替え
    if(sortNextTetriminoCount == TETRIMINO_KINDS){
        shuffleNextTetrimino(nextTetriminoCatalog);
        sortNextTetriminoCount = 0;
    }

    currentTetriminoKind = nextTetriminoCatalog[sortNextTetriminoCount];
    sortNextTetriminoCount++;
    setNewControlTetrimino(currentTetriminoKind);
}

function generateTetriminoAI(howManyTimes){
    let i;

	currentTetriminoAngleAI = TETRIMINO_INITIAL_ANGLE;
	currentTetriminoPositionXAI = TETRIMINO_INITIAL_POSITION_X;
	currentTetriminoPositionYAI = TETRIMINO_INITIAL_POSITION_Y;
    bottomTetriminoPositionYAI = currentTetriminoPositionYAI;
	
	//ゲーム開始時の初回のネクストテトリミノ生成
	if(howManyTimes == generateTetriminoTime.FIRST_TIME){
		//ネクストテトリミノをランダムに並び替えする
		shuffleNextTetriminoAI(nextTetriminoCatalogAI);
		for(i = 0;i < TETRIMINO_NEXTKINDS; i++){
			currentTetriminoKindAI = nextTetriminoCatalogAI[sortNextTetriminoCountAI];
			sortNextTetriminoCountAI++;
			setNewControlTetriminoAI(currentTetriminoKindAI);
		}
	}

	//一通り(7種類)生成したら、再び生成の順番をランダムに並び替え
	if(sortNextTetriminoCountAI == TETRIMINO_KINDS){
		shuffleNextTetriminoAI(nextTetriminoCatalogAI);
		sortNextTetriminoCountAI = 0;
	}

	currentTetriminoKindAI = nextTetriminoCatalogAI[sortNextTetriminoCountAI];
	sortNextTetriminoCountAI++;
	setNewControlTetriminoAI(currentTetriminoKindAI);
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノを操作する関数(フィールドにセット、アンセット)

/*----------------------------------------------------------------------------------------------------*/

function setTetrimino(positionX,positionY,tmpTetrimino) {
    let h,w;
	let collisionCheck;

	currentGhostTetriminoPositionX = positionX;
    currentGhostTetriminoPositionY = positionY;
    
	//ゴーストテトリミノを先にフィールドに設定してあげないとcollisionCheckTetriminoで衝突が起こりバグが発生する
	//つまり、言い換えると、isColossion関数の設計上、FREEの段階で先にゴーストテトリミノを設定してあげないといけない
    collisionCheck = collisionCheckTetrimino(currentGhostTetriminoPositionX,currentGhostTetriminoPositionY + 1, tmpTetrimino);

    while(collisionCheck == 0){
        currentGhostTetriminoPositionY++;
        collisionCheck = collisionCheckTetrimino(currentGhostTetriminoPositionX,currentGhostTetriminoPositionY + 1, tmpTetrimino);
    }
    
    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            switch(tmpTetrimino[h][w]){
				case blockType.CONTROL_LIGHTBLUE:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_LIGHTBLUE;
					break;
				case blockType.CONTROL_YELLOW:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_YELLOW;
					break;
				case blockType.CONTROL_PURPLE:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_PURPLE;
					break;
				case blockType.CONTROL_BLUE:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_BLUE;
					break;
				case blockType.CONTROL_ORANGE:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_ORANGE;
					break;
				case blockType.CONTROL_GREEN:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_GREEN;
					break;
				case blockType.CONTROL_RED:
					playField[currentGhostTetriminoPositionY+h][currentGhostTetriminoPositionX+w] = blockType.FALL_POSITION_RED;
					break;
            }
        }
    }

    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            if (tmpTetrimino[h][w] == blockType.CONTROL_LIGHTBLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_YELLOW
				|| tmpTetrimino[h][w] == blockType.CONTROL_PURPLE
				|| tmpTetrimino[h][w] == blockType.CONTROL_BLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_ORANGE
				|| tmpTetrimino[h][w] == blockType.CONTROL_GREEN
				|| tmpTetrimino[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画するマスならば
                playField[positionY + h][positionX + w] = tmpTetrimino[h][w];//positionY列positionY行ずらしたところに配置
            }//例えば、最初縦4本のテトリミノの場合、最後の固定はplayField[16+0][1+0]=tmpTetrimino[0][0]
        }
    }
}

function setTetriminoAI(positionX,positionY,tmpTetrimino) {
    let h,w;
	let collisionCheck;

	currentGhostTetriminoPositionXAI = positionX;
    currentGhostTetriminoPositionYAI = positionY;
    
	//ゴーストテトリミノを先にフィールドに設定してあげないとcollisionCheckTetriminoで衝突が起こりバグが発生する
	//つまり、言い換えると、isColossion関数の設計上、FREEの段階で先にゴーストテトリミノを設定してあげないといけない
    collisionCheck = collisionCheckTetriminoAI(currentGhostTetriminoPositionXAI,currentGhostTetriminoPositionYAI + 1, tmpTetrimino);

    while(collisionCheck == 0){
        currentGhostTetriminoPositionYAI++;
        collisionCheck = collisionCheckTetriminoAI(currentGhostTetriminoPositionXAI,currentGhostTetriminoPositionYAI + 1, tmpTetrimino);
    }
    
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			switch(tmpTetrimino[h][w]){
				case blockType.CONTROL_LIGHTBLUE:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_LIGHTBLUE;
					break;
				case blockType.CONTROL_YELLOW:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_YELLOW;
					break;
				case blockType.CONTROL_PURPLE:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_PURPLE;
					break;
				case blockType.CONTROL_BLUE:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_BLUE;
					break;
				case blockType.CONTROL_ORANGE:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_ORANGE;
					break;
				case blockType.CONTROL_GREEN:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_GREEN;
					break;
				case blockType.CONTROL_RED:
					playFieldAI[currentGhostTetriminoPositionYAI+h][currentGhostTetriminoPositionXAI+w] = blockType.FALL_POSITION_RED;
					break;
			}
		}
	}

    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
            if (tmpTetrimino[h][w] == blockType.CONTROL_LIGHTBLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_YELLOW
				|| tmpTetrimino[h][w] == blockType.CONTROL_PURPLE
				|| tmpTetrimino[h][w] == blockType.CONTROL_BLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_ORANGE
				|| tmpTetrimino[h][w] == blockType.CONTROL_GREEN
				|| tmpTetrimino[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画するマスならば
                playFieldAI[positionY + h][positionX + w] = tmpTetrimino[h][w];//positionY列positionY行ずらしたところに配置
            }//例えば、最初縦4本のテトリミノの場合、最後の固定はplayField[16+0][1+0]=tmpTetrimino[0][0]
        }
    }
}

function unsetTetrimino(positionX,positionY,tmpTetrimino) {
	let h,w;

    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			if (tmpTetrimino[h][w] == blockType.CONTROL_LIGHTBLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_YELLOW
				|| tmpTetrimino[h][w] == blockType.CONTROL_PURPLE
				|| tmpTetrimino[h][w] == blockType.CONTROL_BLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_ORANGE
				|| tmpTetrimino[h][w] == blockType.CONTROL_GREEN
				|| tmpTetrimino[h][w] == blockType.CONTROL_RED) {
				playField[positionY + h][positionX + w] = blockType.FREE;//positionY列positionY行ずらしたところを削除
			    //この時点では、まだ描画の関数が実行されておらず、FREEに変更しただけなので、画面にテトリミノが残っている
			}
		}
	}

	for (h = 0; h < FIELD_HEIGHT_REAL; h++) {
        for (w = 0; w < FIELD_WIDTH; w++) {
            if (playField[h][w] == blockType.FALL_POSITION_LIGHTBLUE
				|| playField[h][w] == blockType.FALL_POSITION_YELLOW
				|| playField[h][w] == blockType.FALL_POSITION_PURPLE
				|| playField[h][w] == blockType.FALL_POSITION_BLUE
				|| playField[h][w] == blockType.FALL_POSITION_ORANGE
				|| playField[h][w] == blockType.FALL_POSITION_GREEN
				|| playField[h][w] == blockType.FALL_POSITION_RED){
                playField[h][w] = blockType.FREE;
            }
        }
    }
}

function unsetTetriminoAI(positionX,positionY,tmpTetrimino) {
	let h,w;

	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			if (tmpTetrimino[h][w] == blockType.CONTROL_LIGHTBLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_YELLOW
				|| tmpTetrimino[h][w] == blockType.CONTROL_PURPLE
				|| tmpTetrimino[h][w] == blockType.CONTROL_BLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_ORANGE
				|| tmpTetrimino[h][w] == blockType.CONTROL_GREEN
				|| tmpTetrimino[h][w] == blockType.CONTROL_RED) {
				playFieldAI[positionY + h][positionX + w] = blockType.FREE;//positionY列positionY行ずらしたところを削除
				//この時点では、まだ描画の関数が実行されておらず、FREEに変更しただけなので、画面にテトリミノが残っている
			}
		}
	}
	
	for (h = 0; h < FIELD_HEIGHT_REAL; h++) {
		for (w = 0; w < FIELD_WIDTH; w++) {
			if (playFieldAI[h][w] == blockType.FALL_POSITION_LIGHTBLUE
				|| playFieldAI[h][w] == blockType.FALL_POSITION_YELLOW
				|| playFieldAI[h][w] == blockType.FALL_POSITION_PURPLE
				|| playFieldAI[h][w] == blockType.FALL_POSITION_BLUE
				|| playFieldAI[h][w] == blockType.FALL_POSITION_ORANGE
				|| playFieldAI[h][w] == blockType.FALL_POSITION_GREEN
				|| playFieldAI[h][w] == blockType.FALL_POSITION_RED){
				playFieldAI[h][w] = blockType.FREE;
			}
		}
	}
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノを操作する関数(衝突を検知)

/*----------------------------------------------------------------------------------------------------*/

function collisionCheckTetrimino(positionX,positionY,tmpTetrimino) {
	let h,w;

    for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			if (tmpTetrimino[h][w] == blockType.CONTROL_LIGHTBLUE
                || tmpTetrimino[h][w] == blockType.CONTROL_YELLOW
                || tmpTetrimino[h][w] == blockType.CONTROL_PURPLE
                || tmpTetrimino[h][w] == blockType.CONTROL_BLUE
                || tmpTetrimino[h][w] == blockType.CONTROL_ORANGE
                || tmpTetrimino[h][w] == blockType.CONTROL_GREEN
                || tmpTetrimino[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画されていているマスならば
				if (playField[positionY + h][positionX + w] != blockType.FREE) {//移動させたい先がFREEでないのならば
					return 1;//移動できない
				}
			}
		}
	}
	return 0;//移動できる
}

function collisionCheckTetriminoAI(positionX,positionY,tmpTetrimino) {
	let h,w;
    
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			if (tmpTetrimino[h][w] == blockType.CONTROL_LIGHTBLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_YELLOW
				|| tmpTetrimino[h][w] == blockType.CONTROL_PURPLE
				|| tmpTetrimino[h][w] == blockType.CONTROL_BLUE
				|| tmpTetrimino[h][w] == blockType.CONTROL_ORANGE
				|| tmpTetrimino[h][w] == blockType.CONTROL_GREEN
				|| tmpTetrimino[h][w] == blockType.CONTROL_RED) {//もし4×4のうち、描画されていているマスならば
				if (playFieldAI[positionY + h][positionX + w] != blockType.FREE) {//移動させたい先がFREEでないのならば
					return 1;//移動できない
				}
			}
		}
	}
	return 0;//移動できる
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノを操作する関数(左右下移動)

/*----------------------------------------------------------------------------------------------------*/

function moveCurrentTetrimino(positionX,positionY) {
	//壁に衝突しなければ座標を変更する
	if (collisionCheckTetrimino(positionX, positionY, currentTetrimino) == 0) {//もし移動できるのならば
		currentTetriminoPositionX = positionX;//指定の分それぞれ座標をずらす
		currentTetriminoPositionY = positionY;
		return 1;
	}
	return 0;
}

function moveCurrentTetriminoAI(positionX,positionY) {
	//壁に衝突しなければ座標を変更する
	if (collisionCheckTetriminoAI(positionX, positionY, currentTetriminoAI) == 0) {//もし移動できるのならば
		currentTetriminoPositionXAI = positionX;//指定の分それぞれ座標をずらす
		currentTetriminoPositionYAI = positionY;
		return 1;
	}
	return 0;
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノを操作する関数(回転)

/*----------------------------------------------------------------------------------------------------*/

function superRotationSystemCurrentTetriminoStore(tmpTetrimino){
	let h,w;
	//操作中のテトリミノに格納(スーパーローテーションシステムの際に何度も使用されるので関数化)
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			currentTetrimino[h][w] = tmpTetrimino[h][w];
		}
	}
}

function superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino){
	let h,w;
	//操作中のテトリミノに格納(スーパーローテーションシステムの際に何度も使用されるので関数化)
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			currentTetriminoAI[h][w] = tmpTetrimino[h][w];
		}
	}
}

function superRotationSystemCurrentTetriminoCheck(tmpTetrimino,previousCurrentTetriminoAngle) {
	let tmpCurrentTetriminoPositionX;
	let tmpCurrentTetriminoPositionY;
	
	tmpCurrentTetriminoPositionX = currentTetriminoPositionX;
	tmpCurrentTetriminoPositionY = currentTetriminoPositionY;

	if(currentTetriminoKind != 0){//Iではないなら
		
		//1種類目の判定
		switch(currentTetriminoAngle){
			case 1://回転後が右向きなら
				currentTetriminoPositionX--;
				break;
			case 3://回転後が左向きなら
				currentTetriminoPositionX++;
				break;	
			case 0://回転後が上向きなら
			case 2://回転後が下向きなら
				switch(previousCurrentTetriminoAngle){
					case 1://回転前が右向きなら
						currentTetriminoPositionX++;//例えば、T型が右向きで左側の壁に付いてたらここでX座標を+1
						break;
					case 3://回転前が左向きなら
						currentTetriminoPositionX--;//例えば、T型が左向きで右側の壁に付いてたらここでX座標を-1
						break;
				}
				break;
		}
		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			superRotationSystemKind = 1;
			return 1;
		}

		//2種類目の判定
		switch(currentTetriminoAngle){
			case 1:
			case 3:
				currentTetriminoPositionY--;//1種類目の判定で動かせなかった右向きと左向きのテトリミノのY座標をその動かせない位置から-1
				break;		
			case 0:
			case 2:
				currentTetriminoPositionY++;//1種類目の判定で動かせなかった上向きと下向きのテトリミノのY座標をその動かせない位置から+1
				break;
		}
		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			superRotationSystemKind = 2;
			if(currentTetriminoAngle == 0 || currentTetriminoAngle == 2){
				fallDistanceCount++;
			}
			return 1;
		}

		//3種類目の判定
		currentTetriminoPositionX = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionY = tmpCurrentTetriminoPositionY;
		switch(currentTetriminoAngle){
			case 1:
			case 3:
				currentTetriminoPositionY = currentTetriminoPositionY + 2;//2種類目の判定でも動かせなかった右向きと左向きのテトリミノのY座標を最初純粋に回転した位置から+2
				break;		
			case 0:
			case 2:
				currentTetriminoPositionY = currentTetriminoPositionY - 2;//2種類目の判定でも動かせなかった上向きと下向きのテトリミノのY座標を最初純粋に回転した位置から-2
				break;
		}
		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			superRotationSystemKind = 3;
			if(currentTetriminoAngle == 1 || currentTetriminoAngle == 3){
				fallDistanceCount += 2;
			}
			return 1;
		}

		//4種類目の判定
		switch(currentTetriminoAngle){
			case 1:
				currentTetriminoPositionX--;//3種類目の判定でも動かせなかった右向きのテトリミノのX座標をその動かせない位置から-1
				break;		
			case 3:
				currentTetriminoPositionX++;//3種類目の判定でも動かせなかった左向きのテトリミノのX座標をその動かせない位置から+1
				break;
			case 0:
			case 2:
				switch(previousCurrentTetriminoAngle){
					case 1:
						currentTetriminoPositionX++;//3種類目の判定でも動かせず、回転前が右向きで回転後が上向きか下向きなら、X座標をその動かせない位置から+1
						break;
					case 3:
						currentTetriminoPositionX--;//3種類目の判定でも動かせず、回転前が左向きで回転後が上向きか下向きなら、X座標をその動かせない位置から-1
						break;
				}
				break;
		}
		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			superRotationSystemKind = 4;
			if(currentTetriminoAngle == 1 || currentTetriminoAngle == 3){
				fallDistanceCount += 2;
			}
			return 1;
		}
		currentTetriminoPositionX = tmpCurrentTetriminoPositionX;//全てのパターンでダメなら元に戻す(Angleは呼び出し元で戻している)
		currentTetriminoPositionY = tmpCurrentTetriminoPositionY;
	
    }else{//Iなら
		
		//1種類目の判定
		//回転前が上向きかつ回転後が左向き、又は回転前が右向きかつ回転後が下向きなら
		if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX--;
		//以下同様(0＝上、右＝1、下＝2、左＝3)
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 0)){
			currentTetriminoPositionX = currentTetriminoPositionX - 2;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX++;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 0)){
			currentTetriminoPositionX = currentTetriminoPositionX + 2;
		}

		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			return 1;
		}

		currentTetriminoPositionX = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionY = tmpCurrentTetriminoPositionY;

		//2種類目の判定
		//(0＝上、右＝1、下＝2、左＝3)
		if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 3)){
			currentTetriminoPositionX--;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX = currentTetriminoPositionX - 2;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 0)){
			currentTetriminoPositionX++;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX = currentTetriminoPositionX + 2;
		}

		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			return 1;
		}

		currentTetriminoPositionX = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionY = tmpCurrentTetriminoPositionY;

		//3種類目の判定
		//(0＝上、右＝1、下＝2、左＝3)
		if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX--;
			currentTetriminoPositionY = currentTetriminoPositionY - 2;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX = currentTetriminoPositionX - 2;
			currentTetriminoPositionY++;
		}
		else if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 3)){
			currentTetriminoPositionX = currentTetriminoPositionX + 2;
			currentTetriminoPositionY--;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 0)){
			currentTetriminoPositionX++;
			currentTetriminoPositionY = currentTetriminoPositionY + 2;
		}

		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 2)){
				fallDistanceCount++;
			}else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 0)){
				fallDistanceCount += 2;
			}
			return 1;
		}

		currentTetriminoPositionX = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionY = tmpCurrentTetriminoPositionY;

		//4種類目の判定
		//(0＝上、右＝1、下＝2、左＝3)
		if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX = currentTetriminoPositionX + 2;
			currentTetriminoPositionY++;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 2)){
			currentTetriminoPositionX++;
			currentTetriminoPositionY = currentTetriminoPositionY - 2;
		}
		else if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 3)){
			currentTetriminoPositionX--;
			currentTetriminoPositionY = currentTetriminoPositionY + 2;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngle == 0)){
			currentTetriminoPositionX = currentTetriminoPositionX - 2;
			currentTetriminoPositionY--;
		}

		if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStore(tmpTetrimino);
			if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngle == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 2)){
				fallDistanceCount++;
			}else if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngle == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngle == 3)){
				fallDistanceCount += 2;
			}
			return 1;
		}
		currentTetriminoPositionX = tmpCurrentTetriminoPositionX;//全てのパターンでダメなら元に戻す(Angleは呼び出し元で戻している)
		currentTetriminoPositionY = tmpCurrentTetriminoPositionY;
	}
	return 0;
}

function superRotationSystemCurrentTetriminoCheckAI(tmpTetrimino,previousCurrentTetriminoAngle) {
	let tmpCurrentTetriminoPositionX;
	let tmpCurrentTetriminoPositionY;
	
	tmpCurrentTetriminoPositionX = currentTetriminoPositionXAI;
	tmpCurrentTetriminoPositionY = currentTetriminoPositionYAI;

	if(currentTetriminoKindAI != 0){//Iではないなら
		
		//1種類目の判定
		switch(currentTetriminoAngleAI){
			case 1://回転後が右向きなら
				currentTetriminoPositionXAI--;
				break;
			case 3://回転後が左向きなら
				currentTetriminoPositionXAI++;
				break;	
			case 0://回転後が上向きなら
			case 2://回転後が下向きなら
				switch(previousCurrentTetriminoAngle){
					case 1://回転前が右向きなら
						currentTetriminoPositionXAI++;//例えば、T型が右向きで左側の壁に付いてたらここでX座標を+1
						break;
					case 3://回転前が左向きなら
						currentTetriminoPositionXAI--;//例えば、T型が左向きで右側の壁に付いてたらここでX座標を-1
						break;
				}
				break;
		}
		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			superRotationSystemKindAI = 1;
			return 1;
		}

		//2種類目の判定
		switch(currentTetriminoAngleAI){
			case 1:
			case 3:
				currentTetriminoPositionYAI--;//1種類目の判定で動かせなかった右向きと左向きのテトリミノのY座標をその動かせない位置から-1
				break;		
			case 0:
			case 2:
				currentTetriminoPositionYAI++;//1種類目の判定で動かせなかった上向きと下向きのテトリミノのY座標をその動かせない位置から+1
				break;
		}
		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			superRotationSystemKindAI = 2;
			if(currentTetriminoAngleAI == 0 || currentTetriminoAngleAI == 2){
				fallDistanceCountAI++;
			}
			return 1;
		}

		//3種類目の判定
		currentTetriminoPositionXAI = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionYAI = tmpCurrentTetriminoPositionY;
		switch(currentTetriminoAngleAI){
			case 1:
			case 3:
				currentTetriminoPositionYAI = currentTetriminoPositionYAI + 2;//2種類目の判定でも動かせなかった右向きと左向きのテトリミノのY座標を最初純粋に回転した位置から+2
				break;		
			case 0:
			case 2:
				currentTetriminoPositionYAI = currentTetriminoPositionYAI - 2;//2種類目の判定でも動かせなかった上向きと下向きのテトリミノのY座標を最初純粋に回転した位置から-2
				break;
		}
		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			superRotationSystemKindAI = 3;
			if(currentTetriminoAngleAI == 1 || currentTetriminoAngleAI == 3){
				fallDistanceCountAI += 2;
			}
			return 1;
		}

		//4種類目の判定
		switch(currentTetriminoAngleAI){
			case 1:
				currentTetriminoPositionXAI--;//3種類目の判定でも動かせなかった右向きのテトリミノのX座標をその動かせない位置から-1
				break;		
			case 3:
				currentTetriminoPositionXAI++;//3種類目の判定でも動かせなかった左向きのテトリミノのX座標をその動かせない位置から+1
				break;
			case 0:
			case 2:
				switch(previousCurrentTetriminoAngle){
					case 1:
						currentTetriminoPositionXAI++;//3種類目の判定でも動かせず、回転前が右向きで回転後が上向きか下向きなら、X座標をその動かせない位置から+1
						break;
					case 3:
						currentTetriminoPositionXAI--;//3種類目の判定でも動かせず、回転前が左向きで回転後が上向きか下向きなら、X座標をその動かせない位置から-1
						break;
				}
				break;
		}
		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			superRotationSystemKindAI = 4;
			if(currentTetriminoAngleAI == 1 || currentTetriminoAngleAI == 3){
				fallDistanceCountAI += 2;
			}
			return 1;
		}
		currentTetriminoPositionXAI = tmpCurrentTetriminoPositionX;//全てのパターンでダメなら元に戻す(Angleは呼び出し元で戻している)
		currentTetriminoPositionYAI = tmpCurrentTetriminoPositionY;

	}else{//Iなら
		
		//1種類目の判定
		//回転前が上向きかつ回転後が左向き、又は回転前が右向きかつ回転後が下向きなら
		if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI--;
		//以下同様(0＝上、右＝1、下＝2、左＝3)
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 0)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI - 2;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI++;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 0)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI + 2;
		}

		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			return 1;
		}

		currentTetriminoPositionXAI = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionYAI = tmpCurrentTetriminoPositionY;

		//2種類目の判定
		//(0＝上、右＝1、下＝2、左＝3)
		if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 3)){
			currentTetriminoPositionXAI--;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI - 2;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 0)){
			currentTetriminoPositionXAI++;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI + 2;
		}

		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			return 1;
		}

		currentTetriminoPositionXAI = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionYAI = tmpCurrentTetriminoPositionY;

		//3種類目の判定
		//(0＝上、右＝1、下＝2、左＝3)
		if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI--;
			currentTetriminoPositionYAI = currentTetriminoPositionYAI - 2;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI - 2;
			currentTetriminoPositionYAI++;
		}
		else if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 3)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI + 2;
			currentTetriminoPositionYAI--;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 0)){
			currentTetriminoPositionXAI++;
			currentTetriminoPositionYAI = currentTetriminoPositionYAI + 2;
		}

		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 2)){
				fallDistanceCountAI++;
			}else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 0)){
				fallDistanceCountAI += 2;
			}
			return 1;
		}

		currentTetriminoPositionXAI = tmpCurrentTetriminoPositionX;
		currentTetriminoPositionYAI = tmpCurrentTetriminoPositionY;

		//4種類目の判定
		//(0＝上、右＝1、下＝2、左＝3)
		if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI + 2;
			currentTetriminoPositionYAI++;
		}
		else if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 2)){
			currentTetriminoPositionXAI++;
			currentTetriminoPositionYAI = currentTetriminoPositionYAI - 2;
		}
		else if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 3)){
			currentTetriminoPositionXAI--;
			currentTetriminoPositionYAI = currentTetriminoPositionYAI + 2;
		}
		else if((previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 1) || (previousCurrentTetriminoAngle == 3 && currentTetriminoAngleAI == 0)){
			currentTetriminoPositionXAI = currentTetriminoPositionXAI - 2;
			currentTetriminoPositionYAI--;
		}

		if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
			superRotationSystemCurrentTetriminoStoreAI(tmpTetrimino);
			if((previousCurrentTetriminoAngle == 0 && currentTetriminoAngleAI == 3) || (previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 2)){
				fallDistanceCountAI++;
			}else if((previousCurrentTetriminoAngle == 1 && currentTetriminoAngleAI == 0) || (previousCurrentTetriminoAngle == 2 && currentTetriminoAngleAI == 3)){
				fallDistanceCountAI += 2;
			}
			return 1;
		}
		currentTetriminoPositionXAI = tmpCurrentTetriminoPositionX;//全てのパターンでダメなら元に戻す(Angleは呼び出し元で戻している)
		currentTetriminoPositionYAI = tmpCurrentTetriminoPositionY;
	}
	return 0;
}

function rotateCurrentTetrimino(direction) {
    let tmpTetrimino = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let h,w;
	let tmpCurrentTetriminoAngle;

	tmpCurrentTetriminoAngle = currentTetriminoAngle;
	
    //回転後のテトリミノの配置を一時バッファへ入れる
    if (direction == rotateDirection.RIGHT) {//時計回り
        if(currentTetriminoAngle!=TETRIMINO_ANGLES-1){
            currentTetriminoAngle++;
        }else{
            currentTetriminoAngle=0;
        }
        
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                tmpTetrimino[h][w] = tetriminos[currentTetriminoKind][currentTetriminoAngle][h][w];
            }
        }
    } else {//反時計回り
        if(currentTetriminoAngle!=0){
            currentTetriminoAngle--;
        }else{
            currentTetriminoAngle=TETRIMINO_ANGLES-1;
        }
        
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                tmpTetrimino[h][w] = tetriminos[currentTetriminoKind][currentTetriminoAngle][h][w];
            }
        }
    }

	if(collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, tmpTetrimino) == 0){
		for (h = 0; h < TETRIMINO_HEIGHT; h++) {
			for (w = 0; w < TETRIMINO_WIDTH; w++) {
				currentTetrimino[h][w] = tmpTetrimino[h][w];
			}
		}
		//普通の回転が出来るならスーパーローテーションの種類をリセット
		//ただし、4でないことを判定するのみでしか使用しないため、書かなくても問題はない
		superRotationSystemKind = 0;
		return 1;
	//純粋な回転が出来ない際に特殊な回転が出来るか判定する
	}else if(superRotationSystemCurrentTetriminoCheck(tmpTetrimino,tmpCurrentTetriminoAngle) == 0){
		currentTetriminoAngle = tmpCurrentTetriminoAngle;
		return 0;
	}else{
		return 1;
	}
}

function rotateCurrentTetriminoAI(direction) {
    let tmpTetrimino = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let h,w;
	let tmpCurrentTetriminoAngle;

	tmpCurrentTetriminoAngle = currentTetriminoAngleAI;
	
    //回転後のテトリミノの配置を一時バッファへ入れる
    if (direction == rotateDirection.RIGHT) {//時計回り
        if(currentTetriminoAngleAI!=TETRIMINO_ANGLES-1){
            currentTetriminoAngleAI++;
        }else{
            currentTetriminoAngleAI=0;
        }
        
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                tmpTetrimino[h][w] = tetriminos[currentTetriminoKindAI][currentTetriminoAngleAI][h][w];
            }
        }
    } else {//反時計回り
        if(currentTetriminoAngleAI!=0){
            currentTetriminoAngleAI--;
        }else{
            currentTetriminoAngleAI=TETRIMINO_ANGLES-1;
        }
        
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                tmpTetrimino[h][w] = tetriminos[currentTetriminoKindAI][currentTetriminoAngleAI][h][w];
            }
        }
    }

	if(collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, tmpTetrimino) == 0){
		for (h = 0; h < TETRIMINO_HEIGHT; h++) {
			for (w = 0; w < TETRIMINO_WIDTH; w++) {
				currentTetriminoAI[h][w] = tmpTetrimino[h][w];
			}
		}
		//普通の回転が出来るならスーパーローテーションの種類をリセット
		//ただし、4でないことを判定するのみでしか使用しないため、書かなくても問題はない
		superRotationSystemKindAI = 0;
		return 1;
	//純粋な回転が出来ない際に特殊な回転が出来るか判定する
	}else if(superRotationSystemCurrentTetriminoCheckAI(tmpTetrimino,tmpCurrentTetriminoAngle) == 0){
		currentTetriminoAngleAI = tmpCurrentTetriminoAngle;
		return 0;
	}else{
		return 1;
	}
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノを操作する関数(ホールド)

/*----------------------------------------------------------------------------------------------------*/

function holdControlTetrimino(){
    let h,w;
    let tmpTetrimino = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let tmpHoldTetriminoKind;
    
    //ホールドがまだ1回も使用されていない
    if(holdSetFlag == 0){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                currentHoldTetrimino[h][w] = tetriminos[currentTetriminoKind][0][h][w];
            }
        }
        currentHoldTetriminoKind = currentTetriminoKind;
        unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
        holdSetFlag = 1;
        generateTetrimino(generateTetriminoTime.FROM_THE_SECOND_TIME);
    }else{
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                tmpTetrimino[h][w] = tetriminos[currentTetriminoKind][0][h][w];
                currentTetrimino[h][w] = currentHoldTetrimino[h][w];
                currentHoldTetrimino[h][w] = tmpTetrimino[h][w];
            }
        }
        tmpHoldTetriminoKind = currentTetriminoKind;
        currentTetriminoKind = currentHoldTetriminoKind;
        currentHoldTetriminoKind = tmpHoldTetriminoKind;
    }
	
    //2回目以降のホールドは生成を行わず交換のみを行うので、generateTetrimino()に必要な初期位置のリセットのみここに記述
    currentTetriminoAngle = TETRIMINO_INITIAL_ANGLE;
    currentTetriminoPositionX = TETRIMINO_INITIAL_POSITION_X;
    currentTetriminoPositionY = TETRIMINO_INITIAL_POSITION_Y;
    bottomTetriminoPositionY = currentTetriminoPositionY;

    gameOverCheck();
}

function holdControlTetriminoAI(){
    let h,w;
    let tmpTetrimino = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    let tmpHoldTetriminoKind;
    
    //ホールドがまだ1回も使用されていない
    if(holdSetFlagAI == 0){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                currentHoldTetriminoAI[h][w] = tetriminos[currentTetriminoKindAI][0][h][w];
            }
        }
        currentHoldTetriminoKindAI = currentTetriminoKindAI;
        unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
        holdSetFlagAI = 1;
        generateTetriminoAI(generateTetriminoTime.FROM_THE_SECOND_TIME);
    }else{
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                tmpTetrimino[h][w] = tetriminos[currentTetriminoKindAI][0][h][w];
                currentTetriminoAI[h][w] = currentHoldTetriminoAI[h][w];
                currentHoldTetriminoAI[h][w] = tmpTetrimino[h][w];
            }
        }
        tmpHoldTetriminoKind = currentTetriminoKindAI;
        currentTetriminoKindAI = currentHoldTetriminoKindAI;
        currentHoldTetriminoKindAI = tmpHoldTetriminoKind;
    }

    //2回目以降のホールドは生成を行わず交換のみを行うので、generateTetrimino()に必要な初期位置のリセットのみここに記述
    currentTetriminoAngleAI = TETRIMINO_INITIAL_ANGLE;
    currentTetriminoPositionXAI = TETRIMINO_INITIAL_POSITION_X;
    currentTetriminoPositionYAI = TETRIMINO_INITIAL_POSITION_Y;
    bottomTetriminoPositionYAI = currentTetriminoPositionYAI;

    gameOverCheckAI();
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノ固定～次のテトリミノ生成に使用する関数

/*----------------------------------------------------------------------------------------------------*/

function gameOverCheck(){

    let pullY = 0;

	//次のテトリミノが配置できなければゲームオーバー
	if(!collisionCheckTetrimino(TETRIMINO_INITIAL_POSITION_X, TETRIMINO_INITIAL_POSITION_Y, currentTetrimino)){
		pullY = 0;
	}else if(!collisionCheckTetrimino(TETRIMINO_INITIAL_POSITION_X, TETRIMINO_INITIAL_POSITION_Y - 1, currentTetrimino)){
		pullY = 1;
	}else if(!collisionCheckTetrimino(TETRIMINO_INITIAL_POSITION_X, TETRIMINO_INITIAL_POSITION_Y - 2, currentTetrimino)){
		pullY = 2;
	}else{
		currentScreenState = screenState.GAMEOVER;
        gameResultState = gameResult.AI_WIN;//プレイヤーの負け、AIの勝ち
	}

	if(currentScreenState == screenState.PLAYING){
		currentTetriminoPositionY = currentTetriminoPositionY - pullY;
        bottomTetriminoPositionY = currentTetriminoPositionY;
	}
}

function gameOverCheckAI(){

    let pullY = 0;

	//次のテトリミノが配置できなければゲームオーバー
	if(!collisionCheckTetriminoAI(TETRIMINO_INITIAL_POSITION_X, TETRIMINO_INITIAL_POSITION_Y, currentTetriminoAI)){
		pullY = 0;
	}else if(!collisionCheckTetriminoAI(TETRIMINO_INITIAL_POSITION_X, TETRIMINO_INITIAL_POSITION_Y - 1, currentTetriminoAI)){
		pullY = 1;
	}else if(!collisionCheckTetriminoAI(TETRIMINO_INITIAL_POSITION_X, TETRIMINO_INITIAL_POSITION_Y - 2, currentTetriminoAI)){
		pullY = 2;
	}else{
		currentScreenState = screenState.GAMEOVER;
		gameResultState = gameResult.PLAYER_WIN;//プレイヤーの勝ち、AIの負け
	}

	if(currentScreenState == screenState.PLAYING){
        currentTetriminoPositionYAI = currentTetriminoPositionYAI - pullY;
        bottomTetriminoPositionYAI = currentTetriminoPositionYAI;
	}
}

function allClearCheckTetrimino(){
    let h,w;

    for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
            if (playField[h][w] != blockType.FREE) {
                return 0;
            }
        }
    }
	perfectClearCount++;
	allClearFlag = 1;
    return 1;
}

function allClearCheckTetriminoAI(){
    let h,w;

    for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
            if (playFieldAI[h][w] != blockType.FREE) {
                return 0;
            }
        }
    }
	perfectClearCountAI++;
	allClearFlagAI = 1;
    return 1;
}

function gameScoreUp(count,levelUpFlag){
    let addition = 1;
	let hiddenCommandAddition = 0;
	let randnum = 0;
    let score = 0;

    if(allClearCheckTetrimino() == 1){//全消し判定
        addition = 10;
    }

	if(hiddenCommand_rotateDraw_Flag == 1){
		hiddenCommandAddition = hiddenCommandAddition + 10;
	}
	if(hiddenCommand_halfSecretDraw_Flag == 1){
		hiddenCommandAddition = hiddenCommandAddition + 10;
	}
	if(hiddenCommandAddition == 0){//2つともNOなら1に変更
		hiddenCommandAddition = 1;
	}

	if(hiddenCommand_mysteriousAddPoints_Flag == 1){
		randnum = Math.floor(Math.random()*10000);//0～9999
		if(randnum <= 3000){
			mysteriousAddPoints = 1;//謎の加算なし
		}else if(randnum <= 6000){
			mysteriousAddPoints = 1.2;
		}else if(randnum <= 8000){
			mysteriousAddPoints = 1.5;
		}else if(randnum <= 9000){
			mysteriousAddPoints = 2;
		}else if(randnum <= 9500){
			mysteriousAddPoints = 2.5;
		}else if(randnum <= 9800){
			mysteriousAddPoints = 3;
		}else if(randnum <= 9900){
			mysteriousAddPoints = 4;
		}else if(randnum <= 9950){
			mysteriousAddPoints = 10;
		}else if(randnum <= 9980){
			mysteriousAddPoints = 50;
		}else if(randnum <= 9990){
			mysteriousAddPoints = 100;
		}else if(randnum <= 9995){
			mysteriousAddPoints = 300;
		}else if(randnum <= 9998){
			mysteriousAddPoints = 500;
		}else if(randnum == 9999){
			mysteriousAddPoints = 1000;//0.01%の確率で1000倍
		}
	}

    //全消し×レベル×連鎖数*各隠しコマンド加点*謎の倍率
    score = addition * (gameLevel - levelUpFlag) * renCount * hiddenCommandAddition * mysteriousAddPoints;

    switch(count){//素点×全消し×レベル×連鎖数*各隠しコマンド加点*謎の倍率
        case 1:
            gameScore += Math.round(100 * score);
			additionGameScore = Math.round(100 * score);
            break;
        case 2:
            gameScore += Math.round(400 * score);
			additionGameScore = Math.round(400 * score);
            break;
        case 3:
            gameScore += Math.round(900 * score);
			additionGameScore = Math.round(900 * score);
            break;
        case 4:
            gameScore += Math.round(1600 * score);
			additionGameScore = Math.round(1600 * score);
            break;
    }
}

function gameScoreUpAI(count,levelUpFlag){
    let addition = 1;
    let score = 0;

    if(allClearCheckTetriminoAI() == 1){//全消し判定
        addition = 10;
    }

    //全消し×レベル×連鎖数
    score = addition * (gameLevelAI - levelUpFlag) * renCountAI;

    switch(count){//素点×全消し×レベル×連鎖数
        case 1:
            gameScoreAI += Math.round(100 * score);
			additionGameScoreAI = Math.round(100 * score);
            break;
        case 2:
            gameScoreAI += Math.round(400 * score);
			additionGameScoreAI = Math.round(400 * score);
            break;
        case 3:
            gameScoreAI += Math.round(900 * score);
			additionGameScoreAI = Math.round(900 * score);
            break;
        case 4:
            gameScoreAI += Math.round(1600 * score);
			additionGameScoreAI = Math.round(1600 * score);
            break;
    }
}

function eraseLine(eraseLineHeightList) {
    let h,w,i;
    let eraseHeightCount = 0,line;

	for(i = 0; i < eraseLineHeightList.length; i++){
		if(eraseLineHeightList[i] != -1){
			eraseHeightCount++;
			line = eraseLineHeightList[i];
			for (h = line; h >= 1; h--) {
				for (w = 1; w < FIELD_WIDTH - 1; w++){
					playField[h][w] = playField[h-1][w];
				}
			}
		}
	}
	
	//FREEに変更する行数を格納、例えば17,18,19,-1が格納されていたら、0,1,2,-1に上書きする
	for(i = 0; i < eraseHeightCount; i++){
		eraseLineHeightList[i] = i;
	}
	
	//上をFREEで詰める
	for (h = eraseLineHeightList.length - 1; h >= 0 ; h--){
		if(eraseLineHeightList[h] != -1){
			line = eraseLineHeightList[h];
			for (w = 1; w < FIELD_WIDTH - 1; w++) {
				//固定されたテトリミノを削除(FREEへ変更)
				if(playField[line][w] != blockType.FIX_LIGHTBLUE
					|| playField[line][w] != blockType.FIX_YELLOW
					|| playField[line][w] != blockType.FIX_PURPLE
					|| playField[line][w] != blockType.FIX_BLUE
					|| playField[line][w] != blockType.FIX_ORANGE
					|| playField[line][w] != blockType.FIX_GREEN
					|| playField[line][w] != blockType.FIX_RED
					|| playField[line][w] != blockType.GARBAGE){
					playField[line][w] = blockType.FREE;
				}
			}
		}
	}
}

function eraseLineAI(eraseLineHeightListAI) {
    let h,w,i;
    let eraseHeightCount = 0,line;

	for(i = 0; i < eraseLineHeightListAI.length; i++){
		if(eraseLineHeightListAI[i] != -1){
			eraseHeightCount++;
			line = eraseLineHeightListAI[i];
			for (h = line; h >= 1; h--) {
				for (w = 1; w < FIELD_WIDTH - 1; w++){
					playFieldAI[h][w] = playFieldAI[h-1][w];
				}
			}
		}
	}
	
	//FREEに変更する行数を格納、例えば17,18,19,-1が格納されていたら、0,1,2,-1に上書きする
	for(i = 0; i < eraseHeightCount; i++){
		eraseLineHeightListAI[i] = i;
	}

	//上をFREEで詰める
	for (h = eraseLineHeightListAI.length - 1; h >= 0 ; h--){
		if(eraseLineHeightListAI[h] != -1){
			line = eraseLineHeightListAI[h];
			for (w = 1; w < FIELD_WIDTH - 1; w++) {
				//固定されたテトリミノを削除(FREEへ変更)
				if(playFieldAI[line][w] != blockType.FIX_LIGHTBLUE
					|| playFieldAI[line][w] != blockType.FIX_YELLOW
					|| playFieldAI[line][w] != blockType.FIX_PURPLE
					|| playFieldAI[line][w] != blockType.FIX_BLUE
					|| playFieldAI[line][w] != blockType.FIX_ORANGE
					|| playFieldAI[line][w] != blockType.FIX_GREEN
					|| playFieldAI[line][w] != blockType.FIX_RED
					|| playFieldAI[line][w] != blockType.GARBAGE){
					playFieldAI[line][w] = blockType.FREE;
				}
			}
		}
	}
}

function tSpinCheck(){
	let blockExistenceCount = 0;//4隅の埋まっているブロック数
	let blockCheck;//埋まっているか埋まっていないか
	let blockTmp = "";//4隅のブロック情報
	let tSpinMiniCheck = 0;

	if(playField[currentTetriminoPositionY][currentGhostTetriminoPositionX] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	if(playField[currentTetriminoPositionY][currentGhostTetriminoPositionX + 2] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	if(playField[currentTetriminoPositionY + 2][currentGhostTetriminoPositionX] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	if(playField[currentTetriminoPositionY + 2][currentGhostTetriminoPositionX + 2] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	//Tスピンミニ判定
	if(blockExistenceCount == 3){
		switch(currentTetriminoAngle){
			case 0:
				if(blockTmp == "1011" || blockTmp == "0111"){
					tSpinMiniCheck = 1;
				}
				break;
			case 1:
				if(blockTmp == "1110" || blockTmp == "1011"){
					tSpinMiniCheck = 1;
				}
				break;
			case 2:
				if(blockTmp == "1101" || blockTmp == "1110"){
					tSpinMiniCheck = 1;
				}
				break;
			case 3:
				if(blockTmp == "0111" || blockTmp == "1101"){
					tSpinMiniCheck = 1;
				}
				break;
		}
	}

	if(tSpinMiniCheck== 1 && superRotationSystemKind != 4 && rotateFlag == 1){
		tSpinMiniFlag = 1;
	}
	if(blockExistenceCount >= 3 && rotateFlag == 1){
		tSpinFlag = 1;
	}

	if(tSpinMiniFlag == 1 && eraseCount == 1){
		printTSpinKind = "Mini";
		tSpinSingleMiniCount++;
	}else if(tSpinMiniFlag == 1 && eraseCount == 2){
		printTSpinKind = "Double";
		tSpinDoubleMiniCount++;
	}else if(tSpinFlag == 1 && eraseCount == 1){
		printTSpinKind = "Single";
		tSpinSingleCount++;
	}
	else if(tSpinFlag == 1 && eraseCount == 2){
		printTSpinKind = "Double";
		tSpinDoubleCount++;
	}
	else if(tSpinFlag == 1 && eraseCount == 3){
		printTSpinKind = "Triple";
		tSpinTripleCount++;
	}
	tSpinCount = tSpinSingleCount + tSpinDoubleCount + tSpinTripleCount;
	tSpinMiniCount = tSpinSingleMiniCount + tSpinDoubleMiniCount;
}

function tSpinCheckAI(){
	let blockExistenceCount = 0;//4隅の埋まっているブロック数
	let blockCheck;//埋まっているか埋まっていないか
	let blockTmp = "";//4隅のブロック情報
	let tSpinMiniCheck = 0;
    
	if(playFieldAI[currentTetriminoPositionYAI][currentGhostTetriminoPositionXAI] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	if(playFieldAI[currentTetriminoPositionYAI][currentGhostTetriminoPositionXAI + 2] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	if(playFieldAI[currentTetriminoPositionYAI + 2][currentGhostTetriminoPositionXAI] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	if(playFieldAI[currentTetriminoPositionYAI + 2][currentGhostTetriminoPositionXAI + 2] != blockType.FREE){
		blockExistenceCount++;
		blockCheck = 1;
	}else{
		blockCheck = 0;
	}
	blockTmp = blockTmp + blockCheck;

	//Tスピンミニ判定
	if(blockExistenceCount == 3){
		switch(currentTetriminoAngleAI){
			case 0:
				if(blockTmp == "1011" || blockTmp == "0111"){
					tSpinMiniCheck = 1;
				}
				break;
			case 1:
				if(blockTmp == "1110" || blockTmp == "1011"){
					tSpinMiniCheck = 1;
				}
				break;
			case 2:
				if(blockTmp == "1101" || blockTmp == "1110"){
					tSpinMiniCheck = 1;
				}
				break;
			case 3:
				if(blockTmp == "0111" || blockTmp == "1101"){
					tSpinMiniCheck = 1;
				}
				break;
		}
	}

	if(tSpinMiniCheck== 1 && superRotationSystemKindAI != 4 && rotateFlagAI == 1){
		tSpinMiniFlagAI = 1;
	}
	if(blockExistenceCount >= 3 && rotateFlagAI == 1){
		tSpinFlagAI = 1;
	}

	if(tSpinMiniFlagAI == 1 && eraseCountAI == 1){
		printTSpinKindAI = "Mini";
		tSpinSingleMiniCountAI++;
	}else if(tSpinMiniFlagAI == 1 && eraseCountAI == 2){
		printTSpinKindAI = "Double";
		tSpinDoubleMiniCountAI++;
	}else if(tSpinFlagAI == 1 && eraseCountAI == 1){
		printTSpinKindAI = "Single";
		tSpinSingleCountAI++;
	}
	else if(tSpinFlagAI == 1 && eraseCountAI == 2){
		printTSpinKindAI = "Double";
		tSpinDoubleCountAI++;
	}
	else if(tSpinFlagAI == 1 && eraseCountAI == 3){
		printTSpinKindAI = "Triple";
		tSpinTripleCountAI++;
	}
	tSpinCountAI = tSpinSingleCountAI + tSpinDoubleCountAI + tSpinTripleCountAI;
	tSpinMiniCountAI = tSpinSingleMiniCountAI + tSpinDoubleMiniCountAI;
}

function comboCheck(renFlag){
    if(renFlag == 1){
        renCount++;
		//コンボの後に即落下させてコンボを途切れさすと0コンボと表示されるため、コンボ数を保存
		tmpRenCount = renCount;
		if(renCount >= maxCombo){
			maxCombo = renCount;
		}
    }else{
        renCount = 0;
    }
}

function comboCheckAI(renFlag){
    if(renFlag == 1){
        renCountAI++;
		//コンボの後に即落下させてコンボを途切れさすと0コンボと表示されるため、コンボ数を保存
		tmpRenCountAI = renCountAI;
		if(renCountAI >= maxComboAI){
			maxComboAI = renCountAI;
		}
    }else{
        renCountAI = 0;
    }
}

function backToBackCheck(count){
    //Back To Back継続判定
	if(tSpinMiniFlag == 1 || tSpinFlag == 1 || count == 4){
		backToBackFlagCounter++;
	}else if(count >= 1 && count <= 3){//消去ライン数が0行ではリセットされない
		backToBackFlagCounter = 0;
	}
	if(backToBackFlagCounter >= 2 && count != 0){
		backToBackCount++;
	}
}

function backToBackCheckAI(count){
    //Back To Back継続判定
	if(tSpinMiniFlagAI == 1 || tSpinFlagAI == 1 || count == 4){
		backToBackFlagCounterAI++;
	}else if(count >= 1 && count <= 3){//消去ライン数が0行ではリセットされない
		backToBackFlagCounterAI = 0;
	}
	if(backToBackFlagCounterAI >= 2 && count != 0){
		backToBackCountAI++;
	}
}

function fallSpeedUp(){
    switch(gameLevel){
        case 2:
            fallTime = 800;
            break;
        case 3:
            fallTime = 700;
            break;
        case 4:
            fallTime = 650;
            break;
        case 5:
            fallTime = 600;
            break;
        case 6:
            fallTime = 550;
            break;
        case 7:
            fallTime = 500;
            break;
        case 8:
            fallTime = 450;
            break;
        case 9:
            fallTime = 400;
            break;
        case 10:
            fallTime = 350;
            break;

		case 11:
			fallTime = 300;
			break;
		case 12:
			fallTime = 250;
			break;
		case 13:
			fallTime = 200;
			break;
		case 14:
			fallTime = 175;
			break;
		case 15:
			fallTime = 150;
			break;
		case 16:
			fallTime = 125;
			break;
		case 17:
			fallTime = 100;//0.1秒
			break;
		case 18:
			fallTime = 90;
			break;
		case 19:
			fallTime = 80;
			break;
		case 20:
			fallTime = 70;
			break;

		case 21:
			fallTime = 60;
			break;
        case 22:
            fallTime = 50;
            break;
        case 23:
            fallTime = 40;
            break;
        case 24:
            fallTime = 30;
            break;
        case 25:
            fallTime = 20;
            break;
        case 26:
            fallTime = 10;//0.01秒
            break;
        default:
            fallTime = 10;
    }
	clearInterval(mainLoopTimer);
	mainLoopTimer = setInterval(mainLoop,fallTime);
}

function fallSpeedUpAI(){
    switch(gameLevelAI){
        case 2:
            fallTimeAI = 800;
            break;
        case 3:
            fallTimeAI = 700;
            break;
        case 4:
            fallTimeAI = 650;
            break;
        case 5:
            fallTimeAI = 600;
            break;
        case 6:
            fallTimeAI = 550;
            break;
        case 7:
            fallTimeAI = 500;
            break;
        case 8:
            fallTimeAI = 450;
            break;
        case 9:
            fallTimeAI = 400;
            break;
        case 10:
            fallTimeAI = 350;
            break;

		case 11:
			fallTimeAI = 300;
			break;
		case 12:
			fallTimeAI = 250;
			break;
		case 13:
			fallTimeAI = 200;
			break;
		case 14:
			fallTimeAI = 175;
			break;
		case 15:
			fallTimeAI = 150;
			break;
		case 16:
			fallTimeAI = 125;
			break;
		case 17:
			fallTimeAI = 100;//0.1秒
			break;
		case 18:
			fallTimeAI = 90;
			break;
		case 19:
			fallTimeAI = 80;
			break;
		case 20:
			fallTimeAI = 70;
			break;

		case 21:
			fallTimeAI = 60;
			break;
        case 22:
            fallTimeAI = 50;
            break;
        case 23:
            fallTimeAI = 40;
            break;
        case 24:
            fallTimeAI = 30;
            break;
        case 25:
            fallTimeAI = 20;
            break;
        case 26:
            fallTimeAI = 10;//0.01秒
            break;
        default:
            fallTimeAI = 10;
    }
	clearInterval(mainLoopTimerAI);
	mainLoopTimerAI = setInterval(mainLoopAI,fallTimeAI);
}

function levelUp(){
    if(clearLineCount != 0 && clearLineCount % 10 == 0){
        gameLevel++;
        if(aiFlag == 0){
            fallSpeedUp();
        }
        return 1;
    }
    return 0;
}

function levelUpAI(){
    if(clearLineCountAI != 0 && clearLineCountAI % 10 == 0){
        gameLevelAI++;
        if(aiFlag == 0){
            fallSpeedUpAI();
        }
        return 1;
    }
    return 0;
}

function completeOneLineCheck(line) {
	let w;

    for (w = 1; w < FIELD_WIDTH - 1; w++) {
		if (playField[line][w] != blockType.FIX_LIGHTBLUE
            && playField[line][w] != blockType.FIX_YELLOW
            && playField[line][w] != blockType.FIX_PURPLE
            && playField[line][w] != blockType.FIX_BLUE
            && playField[line][w] != blockType.FIX_ORANGE
            && playField[line][w] != blockType.FIX_GREEN
            && playField[line][w] != blockType.FIX_RED
			&& playField[line][w] != blockType.GARBAGE) {//もし埋まっていない(固定されていない)ますがあったら
			return 0;//1行埋まっていない
		}
	}
	return 1;//1行埋まっている
}

function completeOneLineCheckAI(line) {
	let w;

    for (w = 1; w < FIELD_WIDTH - 1; w++) {
		if (playFieldAI[line][w] != blockType.FIX_LIGHTBLUE
            && playFieldAI[line][w] != blockType.FIX_YELLOW
            && playFieldAI[line][w] != blockType.FIX_PURPLE
            && playFieldAI[line][w] != blockType.FIX_BLUE
            && playFieldAI[line][w] != blockType.FIX_ORANGE
            && playFieldAI[line][w] != blockType.FIX_GREEN
            && playFieldAI[line][w] != blockType.FIX_RED
			&& playFieldAI[line][w] != blockType.GARBAGE) {//もし埋まっていない(固定されていない)ますがあったら
			return 0;//1行埋まっていない
		}
	}
	return 1;//1行埋まっている
}

function garbageCheck(){
    let garbage = 0;

    if(eraseCount == 2){
		garbage = 1;
	}else if(eraseCount == 3){
		garbage = 2;
	}else if(eraseCount == 4){
		garbage = 4;
	}

	if(garbageCount >= garbage){//相殺又は溜まっているお邪魔の方が多い
		garbageCount = garbageCount - garbage;
	}else if(garbageCount < garbage){//相殺返し
		garbageCountAI = garbageCountAI + (garbage - garbageCount);
		garbageCount = 0;
	}
}

function garbageCheckAI(){
    let garbage = 0;

    if(eraseCountAI == 2){
		garbage = 1;
	}else if(eraseCountAI == 3){
		garbage = 2;
	}else if(eraseCountAI == 4){
		garbage = 4;
	}

	if(garbageCountAI >= garbage){//相殺又は溜まっているお邪魔の方が多い
		garbageCountAI = garbageCountAI - garbage;
	}else if(garbageCountAI < garbage){//相殺返し
		garbageCount = garbageCount + (garbage - garbageCountAI);
		garbageCountAI = 0;
	}
}

/*----------------------------------------------------------------------------------------------------*/

//テトリミノ固定～次のテトリミノ生成に使用する代表的な関数

/*----------------------------------------------------------------------------------------------------*/

function nextGenerateTetriminoCheck(){

	holdChangeFlag = 0;
	softDropFlag = 0;
    softDropCount = 0;
    softDropOver15TimesFlag = 0;
    softDropFloatingFlag = 0;
	clearTimeout(softDropTimer);

    eraseCount = 0;

    //Tミノ以外の時もリセットするため、tSpinCheckからここに移動
	superRotationSystemKind = 0;
	rotateFlag = 0;

	generateTetrimino(generateTetriminoTime.FROM_THE_SECOND_TIME);

    gameOverCheck();

	if(currentScreenState == screenState.PLAYING){
		setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
	
        clearInterval(mainLoopTimer);
	    mainLoopTimer = setInterval( mainLoop, fallTime );
    }

	loopLockFlag = 0;//各ループを実行できるように解除
}

function nextGenerateTetriminoCheckAI(){

	holdChangeFlagAI = 0;
	softDropFlagAI = 0;
	softDropCountAI = 0;
    softDropOver15TimesFlagAI = 0;
	softDropFloatingFlagAI = 0;
    clearTimeout(softDropTimerAI);

    eraseCountAI = 0;

    //Tミノ以外の時もリセットするため、tSpinCheckからここに移動
	superRotationSystemKindAI = 0;
	rotateFlagAI = 0;

	generateTetriminoAI(generateTetriminoTime.FROM_THE_SECOND_TIME);

    gameOverCheckAI();

	if(currentScreenState == screenState.PLAYING){
		setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);

        //状態がPLAYINGのときのみ実行しないとゲームオーバー後再びゲームをしたら重複して実行されてしまう
        clearInterval(mainLoopTimerAI);
        mainLoopTimerAI = setInterval( mainLoopAI, fallTimeAI );

        evaluationTimerAI = setTimeout( evaluationAI, generateTetriminoSpeed );
    }

	loopLockFlagAI = 0;//各ループを実行できるように解除
}

function eraseTetrimino(){
    let h,levelUpFlag = 0,renFlag = 0,erasePosition = 0,listCount = 0;

    for(h = 0; h < FIELD_HEIGHT_REAL-1; h++) {
        if(completeOneLineCheck(h)) {//1行埋まっているならば(1が返されたならば)
            eraseCount++;
            clearLineCount++;
            renFlag = 1;//連鎖
            if(levelUp() == 1){
                levelUpFlag = 1;
            }
			erasePosition = h;
			eraseLineHeightList[listCount] = h;
			listCount++;
        }
    }

    if(eraseCount == 1){
		singleCount++;
	}else if(eraseCount == 2){
		doubleCount++;
	}else if(eraseCount == 3){
		tripleCount++;
	}else if(eraseCount == 4){
		tetrisCount++;
	}

    comboCheck(renFlag);

    gameScoreUp(eraseCount,levelUpFlag);

    if(currentTetriminoKind == 2){//Tミノならば
		tSpinCheck();
	}
	
    backToBackCheck(eraseCount);

    if(eraseCount == 4){
        //例えば、一番下で4ライン消去されたときは16=(23-3)-4となる。つまり、消去された1番上のラインの1つ上の行数が返される
        positionPrintHeight = (erasePosition - 3) - eraseCount;
    }

    garbageCheck();
}

function eraseTetriminoAI(){
    let h,levelUpFlag = 0,renFlag = 0,erasePosition = 0,listCount = 0;

    for(h = 0; h < FIELD_HEIGHT_REAL-1; h++) {
        if(completeOneLineCheckAI(h)) {//1行埋まっているならば(1が返されたならば)
            eraseCountAI++;
            clearLineCountAI++;
            renFlag = 1;//連鎖
            if(levelUpAI() == 1){
                levelUpFlag = 1;
            }
			erasePosition = h;
			eraseLineHeightListAI[listCount] = h;
			listCount++;
        }
    }

    if(eraseCountAI == 1){
		singleCountAI++;
	}else if(eraseCountAI == 2){
		doubleCountAI++;
	}else if(eraseCountAI == 3){
		tripleCountAI++;
	}else if(eraseCountAI == 4){
		tetrisCountAI++;
	}

    comboCheckAI(renFlag);

    gameScoreUpAI(eraseCountAI,levelUpFlag);

	if(currentTetriminoKindAI == 2){//Tミノならば
		tSpinCheckAI();
	}
	
    backToBackCheckAI(eraseCountAI);

    if(eraseCountAI == 4){
        //例えば、一番下で4ライン消去されたときは16=(23-3)-4となる。つまり、消去された1番上のラインの1つ上の行数が返される
		positionPrintHeightAI = (erasePosition - 3) - eraseCountAI;
    }

    garbageCheckAI();
}

async function eraseEffect() {
    let h,i = 0;
	let startW = 5,endW = 6,w,j,k;

    //消去エフェクト
	if(eraseCount >= 1){
		for(i = 0; i < 5; i++){
			await sleep(30);
			
			for(h = 0; h < FIELD_HEIGHT_REAL -1; h++){
				for(j = 0; j < 4; j++){
					if(eraseLineHeightList[j] != -1 && eraseLineHeightList[j] == h){
						for(w = startW; w <= endW; w++){
							playField[h][w] = blockType.FREE;
						}	
					}
				}
			}
			startW--;
			endW++;

            await drawFieldAllAsync();
		}
		eraseLine(eraseLineHeightList);
		//消去行数をリセットする
		for(k = 0; k < 4; k++){
			eraseLineHeightList[k] = -1;
		}
	}

	if(eraseCount >= 1 && eraseCount <= 3){
		playSoundKeyboard(soundType.ERASE_LINE_1TO3);//ライン消去の音
	}else if(eraseCount == 4){
		playSoundKeyboard(soundType.ERASE_LINE_4);//4ライン消去の音
	}

	if(eraseCount >= 1){
		stopDrawTextId = window.requestAnimationFrame(drawText);
	}
    if(eraseCount == 4){
        stopDrawMoveTextId = window.requestAnimationFrame(drawMoveText);
    }
}

const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


async function eraseEffectAI() {
    let h,i = 0;
	let startW = 5,endW = 6,w,j,k;

    //消去エフェクト
	if(eraseCountAI >= 1){
		for(i = 0; i < 5; i++){
			await sleep(30);
			
			for(h = 0; h < FIELD_HEIGHT_REAL -1; h++){
				for(j = 0; j < 4; j++){
					if(eraseLineHeightListAI[j] != -1 && eraseLineHeightListAI[j] == h){
						for(w = startW; w <= endW; w++){
							playFieldAI[h][w] = blockType.FREE;
						}	
					}
				}
			}
			startW--;
			endW++;
			
            await drawFieldAllAsync();
		}
		eraseLineAI(eraseLineHeightListAI);
		//消去行数をリセットする
		for(k = 0; k < 4; k++){
			eraseLineHeightListAI[k] = -1;
		}
	}

	if(eraseCountAI >= 1 && eraseCountAI <= 3){
		playSoundKeyboard(soundType.ERASE_LINE_1TO3);//ライン消去の音
	}else if(eraseCountAI == 4){
		playSoundKeyboard(soundType.ERASE_LINE_4);//4ライン消去の音
	}

	if(eraseCountAI >= 1){
		stopDrawTextIdAI = window.requestAnimationFrame(drawTextAI);
	}
    if(eraseCountAI == 4){
		stopDrawMoveTextIdAI = window.requestAnimationFrame(drawMoveTextAI);
    }
}

async function generateGarbage(){
    //非同期処理中に敵からお邪魔ブロックが送られてきて処理中に加算された場合でも、加算された値で実行できることを確認
    //お邪魔ブロック
	if(garbageCount >= 1 && eraseCount == 0){//1ライン以上消去された場合はお邪魔を反映しない
		for (i = 0; i < garbageCount; i++) {
			await sleep(30);

            //空白または固定されているテトリミノまたはお邪魔ブロックを1つ上にずらす(操作中のテトリミノはずらさない)
			for (h = 1; h < FIELD_HEIGHT_REAL-1; h++) {
				for (w = 1; w < FIELD_WIDTH -1; w++) {
					if(playField[h][w] == 0 || playField[h][w] >= 9 && playField[h][w] <= 15 || playField[h][w] == 23){
						playField[h - 1][w] = playField[h][w];
					}
				}
			}
            
            //1番下をお邪魔ブロックで埋める
			for (w = 1; w < FIELD_WIDTH -1; w++) {
				playField[23][w] = blockType.GARBAGE;
			}

            //お邪魔ブロックの段に空白を1マス作る
			if(garbageFlag == 0){//1回目のお邪魔ブロックの空白の位置はランダム
				garbageHoleW = 1 + Math.floor(Math.random() * 10);
				playField[23][garbageHoleW] = 0;
				garbageFlag = 1;
			}else if(garbageFlag == 1){//2回目以降
				garbagaeOdds = 1 + Math.floor(Math.random() * 10);
				if(garbagaeOdds <= 7){//70%の確率で前回と同じ列に空白を生成
					playField[23][garbageHoleW] = 0;
				}else{//30%の確率で新たなお邪魔ブロックの空白の位置を決定
					garbageHoleW = 1 + Math.floor(Math.random() * 10);
					playField[23][garbageHoleW] = 0;
				}
			}
		}
		garbageCount = 0;
	}
}

async function generateGarbageAI(){
    //非同期処理中に敵からお邪魔ブロックが送られてきて処理中に加算された場合でも、加算された値で実行できることを確認
    //お邪魔ブロック
	if(garbageCountAI >= 1 && eraseCountAI == 0){//1ライン以上消去された場合はお邪魔を反映しない
		for (i = 0; i < garbageCountAI; i++) {
			await sleep(30);

            //空白または固定されているテトリミノまたはお邪魔ブロックを1つ上にずらす(操作中のテトリミノはずらさない)
			for (h = 1; h < FIELD_HEIGHT_REAL-1; h++) {
				for (w = 1; w < FIELD_WIDTH -1; w++) {
					if(playFieldAI[h][w] == 0 || playFieldAI[h][w] >= 9 && playFieldAI[h][w] <= 15 || playFieldAI[h][w] == 23){
						playFieldAI[h - 1][w] = playFieldAI[h][w];
					}
				}
			}

            //1番下をお邪魔ブロックで埋める
			for (w = 1; w < FIELD_WIDTH -1; w++) {
				playFieldAI[23][w] = blockType.GARBAGE;
			}

            //お邪魔ブロックの段に空白を1マス作る
			if(garbageFlagAI == 0){//1回目のお邪魔ブロックの空白の位置はランダム
				garbageHoleWAI = 1 + Math.floor(Math.random() * 10);
				playFieldAI[23][garbageHoleWAI] = 0;
				garbageFlagAI = 1;
			}else if(garbageFlagAI == 1){//2回目以降
				garbagaeOddsAI = 1 + Math.floor(Math.random() * 10);
				if(garbagaeOddsAI <= 7){//70%の確率で前回と同じ列に空白を生成
					playFieldAI[23][garbageHoleWAI] = 0;
				}else{//30%の確率で新たなお邪魔ブロックの空白の位置を決定
					garbageHoleWAI = 1 + Math.floor(Math.random() * 10);
					playFieldAI[23][garbageHoleWAI] = 0;
				}
			}
		}
		garbageCountAI = 0;
	}
}

async function afterFixed(){
    eraseTetrimino();

    //以下のコードは、お邪魔ブロックを生成、描画する際にお邪魔ブロックが複数空白になるバグが発生したため、
    //非同期処理が上手くいっていない
    //await Promise.all([eraseEffect(), generateGarbage()]); 

    await eraseEffect();

    await generateGarbage();

    nextGenerateTetriminoCheck();
}

async function afterFixedAI(){
    eraseTetriminoAI();

    //await Promise.all([eraseEffectAI(), generateGarbageAI()]); 
	
    await eraseEffectAI();

    await generateGarbageAI();

    nextGenerateTetriminoCheckAI();
}

function fixTetrimino() {
    let h,w;
	let checkH,checkW;

	loopLockFlag = 1;//lock状態にしないとsoftDropJudgementLoop等が実行された際にバグが発生

	//操作中のテトリミノをフィールドへ設定する
	setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);

	//フィールドの操作中のテトリミノを固定
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			checkH = currentTetriminoPositionY + h;
			checkW = currentTetriminoPositionX + w;

			if ((0 <= checkH && checkH < FIELD_HEIGHT_REAL - 1) &&//横12マス×縦25マスのうち、下端1行でない
				(0 < checkW && checkW < FIELD_WIDTH - 1)) {//かつ左右端1行でないのならば

				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_LIGHTBLUE) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_LIGHTBLUE;
				}
				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_YELLOW) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_YELLOW;
				}
				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_PURPLE) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_PURPLE;
				}
				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_BLUE) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_BLUE;
				}
				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_ORANGE) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_ORANGE;
				}
				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_GREEN) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_GREEN;
				}
				if (playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] == blockType.CONTROL_RED) {
					playField[currentTetriminoPositionY+h][currentTetriminoPositionX+w] = blockType.FIX_RED;
				}
			}
		}
	}
    afterFixed();
}

function fixTetriminoAI() {
    let h,w;
	let checkH,checkW;

	loopLockFlagAI = 1;//lock状態にしないとsoftDropJudgementLoop等が実行された際にバグが発生

	//操作中のテトリミノをフィールドへ設定する
	setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);

	//フィールドの操作中のテトリミノを固定
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			checkH = currentTetriminoPositionYAI + h;
			checkW = currentTetriminoPositionXAI + w;

			if ((0 <= checkH && checkH < FIELD_HEIGHT_REAL - 1) &&//横12マス×縦25マスのうち、下端1行でない
				(0 < checkW && checkW < FIELD_WIDTH - 1)) {//かつ左右端1行でないのならば

				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_LIGHTBLUE) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_LIGHTBLUE;
				}
				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_YELLOW) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_YELLOW;
				}
				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_PURPLE) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_PURPLE;
				}
				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_BLUE) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_BLUE;
				}
				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_ORANGE) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_ORANGE;
				}
				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_GREEN) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_GREEN;
				}
				if (playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] == blockType.CONTROL_RED) {
					playFieldAI[currentTetriminoPositionYAI+h][currentTetriminoPositionXAI+w] = blockType.FIX_RED;
				}
			}
		}
	}
    afterFixedAI();
}

/*----------------------------------------------------------------------------------------------------*/

//プレイ画面を描画する関数

/*----------------------------------------------------------------------------------------------------*/

function drawBlockType(search,kind){
    switch(kind){
        case drawBlockKind.FIELD:
            switch(search){
                case blockType.FREE:
                    return COLOR_WHITE;
                case blockType.WALL:
                    return COLOR_BLACK;
                case blockType.CONTROL_LIGHTBLUE:
                case blockType.FIX_LIGHTBLUE:
                    return COLOR_LIGHTBLUE;
                case blockType.CONTROL_YELLOW:
                case blockType.FIX_YELLOW:
                    return COLOR_YELLOW;
                case blockType.CONTROL_PURPLE:
                case blockType.FIX_PURPLE:
                    return COLOR_PURPLE;
                case blockType.CONTROL_BLUE:
                case blockType.FIX_BLUE:
                    return COLOR_BLUE;
                case blockType.CONTROL_ORANGE:
                case blockType.FIX_ORANGE:
                    return COLOR_ORANGE;
                case blockType.CONTROL_GREEN:
                case blockType.FIX_GREEN:
                    return COLOR_GREEN;
                case blockType.CONTROL_RED:
                case blockType.FIX_RED:
                    return COLOR_RED;
                case blockType.FALL_POSITION_LIGHTBLUE:
                    return COLOR_LIGHTBLUE_FALL;
                case blockType.FALL_POSITION_YELLOW:
                    return COLOR_YELLOW_FALL;
                case blockType.FALL_POSITION_PURPLE:
                    return COLOR_PURPLE_FALL;
                case blockType.FALL_POSITION_BLUE:
                    return COLOR_BLUE_FALL;
                case blockType.FALL_POSITION_ORANGE:
                    return COLOR_ORANGE_FALL;
                case blockType.FALL_POSITION_GREEN:
                    return COLOR_GREEN_FALL;
                case blockType.FALL_POSITION_RED:
                    return COLOR_RED_FALL;
                case blockType.GARBAGE:
                    return COLOR_GARBAGE;
            }
        case drawBlockKind.NEXT:
        case drawBlockKind.HOLD:
            switch(search){
                case blockType.CONTROL_LIGHTBLUE:
                    gameWindow.fillStyle = COLOR_LIGHTBLUE;
                    break;
                case blockType.CONTROL_YELLOW:
                    gameWindow.fillStyle = COLOR_YELLOW;
                    break;
                case blockType.CONTROL_PURPLE:
                    gameWindow.fillStyle = COLOR_PURPLE;
                    break;
                case blockType.CONTROL_BLUE:
                    gameWindow.fillStyle = COLOR_BLUE;
                    break;
                case blockType.CONTROL_ORANGE:
                    gameWindow.fillStyle = COLOR_ORANGE;
                    break;
                case blockType.CONTROL_GREEN:
                    gameWindow.fillStyle = COLOR_GREEN;
                    break;
                case blockType.CONTROL_RED:
                    gameWindow.fillStyle = COLOR_RED;
                    break;
                default:
                    gameWindow.fillStyle = COLOR_BLACK;
            }
    }
}

function drawField(){
	let h,w;
    let width = 0;
    
	clearGameWindow();

	if(aiFlag == 1){
		gameWindow.fillStyle=COLOR_GARBAGE;
		gameWindow.font="20px serif";
		gameWindow.fillText("YOU",283,18);
		//gameWindow.fillText("AI",866,18);
        gameWindow.fillText("AI(Level:" + aiLevel + ")",828,18);

        width = 0.66*TETRIMINO_SIZE;//AI対戦時はお邪魔ブロックがあるので調整
	}
    
	for(h=3; h<FIELD_HEIGHT_REAL; h++){
		for(w=0; w<FIELD_WIDTH; w++){
			
            gameWindow.fillStyle = drawBlockType(playField[h][w],drawBlockKind.FIELD);

			if(hiddenCommand_rotateDraw_Flag == 0){//1マス描画
				gameWindow.fillRect(w*TETRIMINO_SIZE + FIELD_LEFT_WIDTH + width, (h - 3)*TETRIMINO_SIZE+ TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);//1引いて隙間をつくる
			}else if(hiddenCommand_rotateDraw_Flag == 1){
				//フィールドを反転させて表示させる
				gameWindow.fillRect((FIELD_WIDTH - w - 1) * TETRIMINO_SIZE + FIELD_LEFT_WIDTH + width, (FIELD_HEIGHT_REAL - h - 1) * TETRIMINO_SIZE + TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);
			}

            if(hiddenCommand_rotateDraw_Flag == 0){//上側のときに半分塗りつぶす
				if(h== 3){
					gameWindow.fillStyle = COLOR_BLACK;//冗長に見えるが一定の条件を満たしたときのみ呼び出した方が良いのでif文の中に何度も記述している
					gameWindow.fillRect(w*TETRIMINO_SIZE + FIELD_LEFT_WIDTH + width, (h - 3)*TETRIMINO_SIZE+ TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-6);//上側を黒と白で塗り分ける(黒色を描画する)
				}
			}else if(hiddenCommand_rotateDraw_Flag == 1){//上下逆で描写の場合
				if(h == 24){
                    gameWindow.fillStyle = COLOR_BLACK;
					gameWindow.fillRect(w*TETRIMINO_SIZE + FIELD_LEFT_WIDTH + width, (h - 3)*TETRIMINO_SIZE+ TETRIMINO_SIZE + 5, TETRIMINO_SIZE-1, TETRIMINO_SIZE-6);//上側を黒と白で塗り分ける(黒色を描画する)
				}
			}

			if(hiddenCommand_halfSecretDraw_Flag== 1){
				if(hiddenCommand_rotateDraw_Flag == 0){
					if(h >= 14 && playField[h][w] != blockType.WALL){//h>=14で下10行目隠し
						gameWindow.fillStyle = COLOR_GRAY_HALFSECRETDRAW;
                        gameWindow.fillRect(w*TETRIMINO_SIZE + FIELD_LEFT_WIDTH + width, (h - 3)*TETRIMINO_SIZE+ TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);

					}
				}else if(hiddenCommand_rotateDraw_Flag == 1){
					if(h >= 14 && playField[h][w] != blockType.WALL){//h>=14で上10行目隠し
						gameWindow.fillStyle = COLOR_GRAY_HALFSECRETDRAW;
                        gameWindow.fillRect((FIELD_WIDTH - w - 1) * TETRIMINO_SIZE + FIELD_LEFT_WIDTH + width, (FIELD_HEIGHT_REAL - h - 1) * TETRIMINO_SIZE + TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);

					}
				}
			}
		}
	}

	if(aiFlag == 1){
		for(h=3; h<FIELD_HEIGHT_REAL; h++){
			for(w=0; w<FIELD_WIDTH; w++){
				
                gameWindow.fillStyle = drawBlockType(playFieldAI[h][w],drawBlockKind.FIELD);
	
				gameWindow.fillRect(w*TETRIMINO_SIZE + FIELD_LEFT_WIDTH + SCREEN_WIDTH_DRAW_AI + width, (h - 3)*TETRIMINO_SIZE+ TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);//1引いて隙間をつくる、0.66*BLOCK_SIZEはお邪魔ブロックを画面に追加したので調整
	
				if(h== 3){
					gameWindow.fillStyle = COLOR_BLACK;
					gameWindow.fillRect(w*TETRIMINO_SIZE + FIELD_LEFT_WIDTH + SCREEN_WIDTH_DRAW_AI + width, (h - 3)*TETRIMINO_SIZE+ TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-6);//上側を黒と白で塗り分ける(黒色を描画する)
				}
			}
		}
	}
}

function drawFieldNext(){
	let i,h,w,height = 0;

	gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("NEXT",475,42);

	for(i = 0; i < TETRIMINO_NEXTKINDS; i++){
        for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = COLOR_BLACK;
				gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
            }
        }
        height = height + (3*TETRIMINO_SIZE);
    }

	height = 0;
	for(i = 0; i < TETRIMINO_NEXTKINDS; i++){
        for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = drawBlockType(currentNextTetriminos[i][h][w],drawBlockKind.NEXT);
				gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
			}
		}
		height = height + (3 * TETRIMINO_SIZE);
	}

	if(aiFlag == 1){
		height = 0;
		for(i = 0; i < TETRIMINO_NEXTKINDS; i++){
			for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					gameWindow.fillStyle = COLOR_BLACK;
					gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE + SCREEN_WIDTH_DRAW_AI, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
				}
			}
			height = height + (3*TETRIMINO_SIZE);
		}

		height = 0;
		for(i = 0; i < TETRIMINO_NEXTKINDS; i++){
			for (h = 0; h < TETRIMINO_HEIGHT - 2; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					gameWindow.fillStyle = drawBlockType(currentNextTetriminosAI[i][h][w],drawBlockKind.NEXT);
					gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE + SCREEN_WIDTH_DRAW_AI, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
				}
			}
			height = height + (3 * TETRIMINO_SIZE);
		}
	}
}

function drawFieldNextBig(){
	let i,h,w,height = 0;
	gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("NEXT",475,42);

	for(i = 0; i < TETRIMINO_NEXTKINDS - 2; i++){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = COLOR_BLACK;
				gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
            }
        }
        height = height + (5*TETRIMINO_SIZE);
    }
    
	height = 0;
	for(i = 0; i < TETRIMINO_NEXTKINDS - 2; i++){
        for (h = 0; h < TETRIMINO_HEIGHT; h++) {
            for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = drawBlockType(currentNextTetriminos[i][h][w],drawBlockKind.NEXT);
				gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
			}
		}
		height = height + (5*TETRIMINO_SIZE);
	}

	if(aiFlag == 1){
		height = 0;
		for(i = 0; i < TETRIMINO_NEXTKINDS - 2; i++){
			for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					gameWindow.fillStyle = COLOR_BLACK;
					gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE + SCREEN_WIDTH_DRAW_AI, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
				}
			}
			height = height + (5*TETRIMINO_SIZE);
		}
		height = 0;
		for(i = 0; i < TETRIMINO_NEXTKINDS - 2; i++){
			for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					gameWindow.fillStyle = drawBlockType(currentNextTetriminosAI[i][h][w],drawBlockKind.NEXT);
					gameWindow.fillRect(w*TETRIMINO_SIZE + TETRIMINO_SIZE * FIELD_WIDTH + FIELD_LEFT_WIDTH + TETRIMINO_SIZE + SCREEN_WIDTH_DRAW_AI, h*TETRIMINO_SIZE+height + 2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
				}
			}
			height = height + (5*TETRIMINO_SIZE);
		}
	}
}

function drawFieldHold(){
	let h,w;

	gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("HOLD",40,42);

	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
        for (w = 0; w < TETRIMINO_WIDTH; w++) {
			gameWindow.fillStyle = COLOR_BLACK;
			gameWindow.fillRect(w*TETRIMINO_SIZE+TETRIMINO_SIZE, h*TETRIMINO_SIZE+2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);
		}
	}

	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
            gameWindow.fillStyle = drawBlockType(currentHoldTetrimino[h][w],drawBlockKind.HOLD);

			if(currentHoldTetrimino[h][w] >=2 && currentHoldTetrimino[h][w] <= 8){//描画されるマスならば
				if(holdChangeFlag == 1){
					gameWindow.fillStyle = COLOR_GRAY_HOLD;
				}
			}
			gameWindow.fillRect(w*TETRIMINO_SIZE+TETRIMINO_SIZE, h*TETRIMINO_SIZE+2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);
		}
	}

	if(aiFlag == 1){
		gameWindow.fillText("HOLD",616,42);
		for (h = 0; h < TETRIMINO_HEIGHT; h++) {
			for (w = 0; w < TETRIMINO_WIDTH; w++) {
				gameWindow.fillStyle = COLOR_BLACK;
				gameWindow.fillRect(w*TETRIMINO_SIZE+TETRIMINO_SIZE + SCREEN_WIDTH_DRAW_AI, h*TETRIMINO_SIZE+2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);
			}
		}
	
		for (h = 0; h < TETRIMINO_HEIGHT; h++) {
			for (w = 0; w < TETRIMINO_WIDTH; w++) {
                gameWindow.fillStyle = drawBlockType(currentHoldTetriminoAI[h][w],drawBlockKind.HOLD);

				if(currentHoldTetriminoAI[h][w] >=2 && currentHoldTetriminoAI[h][w] <= 8){//描画されるマスならば
					if(holdChangeFlagAI == 1){
						gameWindow.fillStyle = COLOR_GRAY_HOLD;
					}
				}
				gameWindow.fillRect(w*TETRIMINO_SIZE+TETRIMINO_SIZE + SCREEN_WIDTH_DRAW_AI, h*TETRIMINO_SIZE+2*TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1);
			}
		}
	}
}

function drawScore() {
    gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("SCORE",37,260);
	gameWindow.fillText(('000000000'+gameScore).slice(-9),22,260+TETRIMINO_SIZE);

	if(aiFlag == 1){
		gameWindow.fillText("SCORE",37 + SCREEN_WIDTH_DRAW_AI,260);
		gameWindow.fillText(('000000000'+gameScoreAI).slice(-9),22 + SCREEN_WIDTH_DRAW_AI,260+TETRIMINO_SIZE);
	}
}

function drawHighScore(){
	gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="16px serif";
	gameWindow.fillText("HIGHSCORE",20,188);
	gameWindow.font="20px serif";
	gameWindow.fillText(('000000000'+localStorageRankingTetris[0][0]).slice(-9),22,188+TETRIMINO_SIZE);

	if(aiFlag == 1){
		gameWindow.font="16px serif";
		gameWindow.fillText("HIGHSCORE",20 + SCREEN_WIDTH_DRAW_AI,188);
		gameWindow.font="20px serif";
		gameWindow.fillText("999999999",22 + SCREEN_WIDTH_DRAW_AI,188+TETRIMINO_SIZE);
	}
}

function drawClearLines(){
    gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("LINES",43,332);
	gameWindow.fillText(('000'+clearLineCount).slice(-3),55,332+TETRIMINO_SIZE);

	if(aiFlag == 1){
		gameWindow.fillText("LINES",43 + SCREEN_WIDTH_DRAW_AI,332);
		gameWindow.fillText(('000'+clearLineCountAI).slice(-3),55 + SCREEN_WIDTH_DRAW_AI,332+TETRIMINO_SIZE);
	}
}

function drawGameLevels(){
    gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("LEVEL",40,404);
	gameWindow.fillText(('00'+gameLevel).slice(-2),60,404+TETRIMINO_SIZE);

	if(aiFlag == 1){
		gameWindow.fillText("LEVEL",40 + SCREEN_WIDTH_DRAW_AI,404);
		gameWindow.fillText(('00'+gameLevelAI).slice(-2),60 + SCREEN_WIDTH_DRAW_AI,404+TETRIMINO_SIZE);
	}
}

function drawRens(){
    gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("COMBO",31,476);
	gameWindow.fillText(('00'+renCount).slice(-2),60,476+TETRIMINO_SIZE);

	if(aiFlag == 1){
		gameWindow.fillText("COMBO",31 + SCREEN_WIDTH_DRAW_AI,476);
		gameWindow.fillText(('00'+renCountAI).slice(-2),60 + SCREEN_WIDTH_DRAW_AI,476+TETRIMINO_SIZE);
	}

}

function drawTetris(){
	gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	gameWindow.fillText("TETRIS",35,548);
	gameWindow.fillText(('00'+tetrisCount).slice(-2),60,548+TETRIMINO_SIZE);

	if(aiFlag == 1){
		gameWindow.fillText("TETRIS",35 + SCREEN_WIDTH_DRAW_AI,548);
		gameWindow.fillText(('00'+tetrisCountAI).slice(-2),60 + SCREEN_WIDTH_DRAW_AI,548+TETRIMINO_SIZE);
	}
}

function drawPerfectClear(){
	gameWindow.fillStyle=COLOR_BLACK;
	gameWindow.font="20px serif";
	if(hiddenCommand_changeTetrimino_Flag == 0){
		gameWindow.fillText("PERFECT",456,500);
		gameWindow.fillText(('00'+perfectClearCount).slice(-2),488,500+TETRIMINO_SIZE);
	}
	else if(hiddenCommand_changeTetrimino_Flag == 1){
		gameWindow.fillText("PERFECT",456,500+2*TETRIMINO_SIZE);
		gameWindow.fillText(('00'+perfectClearCountAI).slice(-2),488,500+3*TETRIMINO_SIZE);
	}

	if(aiFlag == 1){
		if(hiddenCommand_changeTetrimino_Flag == 0){
			gameWindow.fillText("PERFECT",456 + SCREEN_WIDTH_DRAW_AI,500);
			gameWindow.fillText(('00'+perfectClearCount).slice(-2),488 + SCREEN_WIDTH_DRAW_AI,500+TETRIMINO_SIZE);
		}
		else if(hiddenCommand_changeTetrimino_Flag == 1){
			gameWindow.fillText("PERFECT",456 + SCREEN_WIDTH_DRAW_AI,500+2*TETRIMINO_SIZE);
			gameWindow.fillText(('00'+perfectClearCountAI).slice(-2),488 + SCREEN_WIDTH_DRAW_AI,500+3*TETRIMINO_SIZE);
		}
	}
}

function drawGarbage(){
	let i;

	if(aiFlag == 1){
        //プレイヤー
		gameWindow.fillStyle=COLOR_WHITE;
		for(i = 2; i < TETRIMINO_GARBAGES + 2; i++){
			gameWindow.fillRect(5*TETRIMINO_SIZE + 0.33*TETRIMINO_SIZE, i * TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
		}

		gameWindow.fillStyle=COLOR_GARBAGE;
		for(i = TETRIMINO_GARBAGES + 1; i > TETRIMINO_GARBAGES + 1 - garbageCount; i--){//下側から個数分だけ表示
			gameWindow.fillRect(5*TETRIMINO_SIZE + 0.33*TETRIMINO_SIZE, i * TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
		}

        //AI
        gameWindow.fillStyle=COLOR_WHITE;
        for(i = 2; i < TETRIMINO_GARBAGES + 2; i++){
            gameWindow.fillRect(29*TETRIMINO_SIZE + 0.33*TETRIMINO_SIZE, i * TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
        }

        gameWindow.fillStyle=COLOR_GARBAGE;
        for(i = TETRIMINO_GARBAGES + 1; i > TETRIMINO_GARBAGES + 1 - garbageCountAI; i--){//定数を使用しない書き方は、for(i = 21; i > 21 - garbageCountAI; i--){
            gameWindow.fillRect(29*TETRIMINO_SIZE + 0.33*TETRIMINO_SIZE, i * TETRIMINO_SIZE, TETRIMINO_SIZE-1, TETRIMINO_SIZE-1); 
        }
    }
}

function drawDebug(){
	if(DEBUG_MODE == 1){
		clearDebugWindow();
		debugWindow.fillStyle=COLOR_BLACK;
		debugWindow.font="20px serif";
	
        if(DEBUG_KIND == 0){
            debugWindow.fillText("デバッグモード起動中",10,1*TETRIMINO_SIZE);
	
            debugWindow.fillText("AIの個体作成："+numberOfTrials+"個目(100個中)",10,3*TETRIMINO_SIZE);
            debugWindow.fillText("AIの試行回数："+playCountAI+"回目(10回中)",10,4*TETRIMINO_SIZE);
    
            debugWindow.fillText("AIの合計消去ライン数："+('000000000'+sumClearLineCountAI).slice(-9),10,6*TETRIMINO_SIZE);
            if(endEvaluationFlag == 0){
                debugWindow.fillText("AIの平均消去ライン数："+sumClearLineCountAI/(playCountAI - 1),10,7*TETRIMINO_SIZE);
            }else if(endEvaluationFlag == 1){ 
                debugWindow.fillText("AIの平均消去ライン数："+sumClearLineCountAI/playCountAI,10,7*TETRIMINO_SIZE);
            }
            debugWindow.fillText("AIの最大消去ライン数："+('000000000'+maxClearLineCountAI).slice(-9),10,8*TETRIMINO_SIZE);
            debugWindow.fillText("AIの最小消去ライン数："+('000000000'+minClearLineCountAI).slice(-9),10,9*TETRIMINO_SIZE);
            debugWindow.fillText("AIの合計テトリス回数："+('000000000'+sumTetrisCountAI).slice(-9),10,10*TETRIMINO_SIZE);
            debugWindow.fillText("AIの合計全消し回数："+('000000000'+sumPerfectClearCountAI).slice(-9),10,11*TETRIMINO_SIZE);
    
            
            debugWindow.fillText("AIの現在消去ライン数："+('000000000'+clearLineCountAI).slice(-9),10,13*TETRIMINO_SIZE);
            debugWindow.fillText("AIの現在テトリス回数："+('000000000'+tetrisCountAI).slice(-9),10,14*TETRIMINO_SIZE);
            debugWindow.fillText("AIの合計全消し回数："+('000000000'+perfectClearCountAI).slice(-9),11,15*TETRIMINO_SIZE);
    
            debugWindow.fillText("評価関数の重み(乱数)",10,17*TETRIMINO_SIZE);
            debugWindow.fillText("holeCountCoefficient："+holeCountCoefficient,10,18*TETRIMINO_SIZE);
            debugWindow.fillText("holeUpTetriminoCountCoefficient："+holeUpTetriminoCountCoefficient,10,19*TETRIMINO_SIZE);
            debugWindow.fillText("holeColumnCountCoefficient："+holeColumnCountCoefficient,10,20*TETRIMINO_SIZE);
            debugWindow.fillText("sumHeightCoefficient："+sumHeightCoefficient,10,21*TETRIMINO_SIZE);
            debugWindow.fillText("maxHeightCoefficient："+maxHeightCoefficient,10,22*TETRIMINO_SIZE);
            debugWindow.fillText("differenceHeightSumCoefficient："+differenceHeightSumCoefficient,10,23*TETRIMINO_SIZE);
            debugWindow.fillText("putTetriminoHeightCoefficient："+putTetriminoHeightCoefficient,10,24*TETRIMINO_SIZE);
            debugWindow.fillText("rowChangeCountCoefficient："+rowChangeCountCoefficient,10,25*TETRIMINO_SIZE);
            debugWindow.fillText("columnChangeCountCoefficient："+columnChangeCountCoefficient,10,26*TETRIMINO_SIZE);
            debugWindow.fillText("completeLineCountCoefficient："+completeLineCountCoefficient,10,27*TETRIMINO_SIZE);         
        
        }else if(DEBUG_KIND == 1){
		debugWindow.fillText("softDropCount："+('00'+softDropCount).slice(-2),10,1*TETRIMINO_SIZE);
	
		debugWindow.fillText("bottomTetriminoPosition："+('00'+bottomTetriminoPositionY).slice(-2),10,3*TETRIMINO_SIZE);
		debugWindow.fillText("currentTetriminoPositionY："+('00'+currentTetriminoPositionY).slice(-2),10,4*TETRIMINO_SIZE);
	
		debugWindow.fillText("softDropFlag："+('00'+softDropFlag).slice(-2),10,6*TETRIMINO_SIZE);
        debugWindow.fillText("softDropOver15TimesFlag："+('00'+softDropOver15TimesFlag).slice(-2),10,7*TETRIMINO_SIZE);
        debugWindow.fillText("softDropFloatingFlag："+('00'+softDropFloatingFlag).slice(-2),10,8*TETRIMINO_SIZE);

        debugWindow.fillText("softDropTimer："+('00'+softDropTimer).slice(-2),10,10*TETRIMINO_SIZE);
		//テンプレ
		//debugWindow.fillText("："+('00'+).slice(-2),10,*TETRIMINO_SIZE);
        
        }else if(DEBUG_KIND == 2){
            debugWindow.fillText("elapsedTimeCountTimer："+('00'+elapsedTimeCountTimer).slice(-2),10,1*TETRIMINO_SIZE);
            debugWindow.fillText("drawLoopTimer："+('00'+drawLoopTimer).slice(-2),10,2*TETRIMINO_SIZE);

            debugWindow.fillText("softDropTimer："+('00'+softDropTimer).slice(-2),10,4*TETRIMINO_SIZE);
            debugWindow.fillText("mainLoopTimer："+('00'+mainLoopTimer).slice(-2),10,5*TETRIMINO_SIZE);
            debugWindow.fillText("softDropJudgementTimer："+('00'+softDropJudgementTimer).slice(-2),10,6*TETRIMINO_SIZE);

            debugWindow.fillText("softDropTimerAI："+('00'+softDropTimerAI).slice(-2),10,8*TETRIMINO_SIZE);
            debugWindow.fillText("mainLoopTimerAI："+('00'+mainLoopTimerAI).slice(-2),10,9*TETRIMINO_SIZE);
            debugWindow.fillText("softDropJudgementTimerAI："+('00'+softDropTimerAI).slice(-2),10,10*TETRIMINO_SIZE);
        }
    }
}

function drawMoveText(){
	clearMoveTextPlayerWindow();

	if(moveTextFlag == 0){
		movePositionW = 206;
		movePositionH = TETRIMINO_SIZE*positionPrintHeight + TETRIMINO_SIZE * 5;
		moveTextFlag = 1;
	}

	moveTextPlayerWindow.lineWidth = 2;
	moveTextPlayerWindow.font = "50px cursive";
	//影
	moveTextPlayerWindow.fillStyle = "#A9A9A9";
	moveTextPlayerWindow.fillText("TETRIS", movePositionW + 4, movePositionH + 4);
	//文字
	moveTextPlayerWindow.fillStyle = "#FF00FF";
	moveTextPlayerWindow.fillText("TETRIS", movePositionW, movePositionH);
	//枠
	moveTextPlayerWindow.lineWidth = 1.5;
	moveTextPlayerWindow.strokeStyle = "#000000";
	moveTextPlayerWindow.strokeText("TETRIS", movePositionW, movePositionH);

	//-1ずつでBLOCK_SIZE×3(72回)ループする
	if(moveTextHeightCount <=10){
		movePositionH = movePositionH - 4;
		moveTextHeightCount++;
	}else if(moveTextHeightCount <=18){
		movePositionH = movePositionH - 2;
		moveTextHeightCount++;
	}else if(moveTextHeightCount <=24){
		movePositionH = movePositionH - 1;
		moveTextHeightCount++;
	}else if(moveTextHeightCount <=29){
		movePositionH = movePositionH - 0.5;
		moveTextHeightCount++;
	}else{
		movePositionH = movePositionH - 0.2;
		moveTextHeightCount++;
	}
	
	if(movePositionH <= TETRIMINO_SIZE*positionPrintHeight + TETRIMINO_SIZE * 2){
		window.cancelAnimationFrame(stopDrawMoveTextId);
		clearMoveTextPlayerWindow();
		moveTextFlag = 0;
		moveTextHeightCount = 0;
		return;
	}
	window.requestAnimationFrame(drawMoveText);
}

function drawMoveTextAI(){
	clearMoveTextAIWindow();

	if(moveTextFlagAI == 0){
		movePositionWAI = 206 + SCREEN_WIDTH_DRAW_AI;//AI用に右にずらす
		movePositionHAI = TETRIMINO_SIZE*positionPrintHeightAI + TETRIMINO_SIZE * 5;
		moveTextFlagAI = 1;
	}

	moveTextAIWindow.lineWidth = 2;
	moveTextAIWindow.font = "50px cursive";
	//影
	moveTextAIWindow.fillStyle = "#A9A9A9";
	moveTextAIWindow.fillText("TETRIS", movePositionWAI + 4, movePositionHAI + 4);
	//文字
	moveTextAIWindow.fillStyle = "#FF00FF";
	moveTextAIWindow.fillText("TETRIS", movePositionWAI, movePositionHAI);
	//枠
	moveTextAIWindow.lineWidth = 1.5;
	moveTextAIWindow.strokeStyle = "#000000";
	moveTextAIWindow.strokeText("TETRIS", movePositionWAI, movePositionHAI);

	//-1ずつでBLOCK_SIZE×3(72回)ループする
	if(moveTextHeightCountAI <=10){
		movePositionHAI = movePositionHAI - 4;
		moveTextHeightCountAI++;
	}else if(moveTextHeightCountAI <=18){
		movePositionHAI = movePositionHAI - 2;
		moveTextHeightCountAI++;
	}else if(moveTextHeightCountAI <=24){
		movePositionHAI = movePositionHAI - 1;
		moveTextHeightCountAI++;
	}else if(moveTextHeightCountAI <=29){
		movePositionHAI = movePositionHAI - 0.5;
		moveTextHeightCountAI++;
	}else{
		movePositionHAI = movePositionHAI - 0.2;
		moveTextHeightCountAI++;
	}
	
	if(movePositionHAI <= TETRIMINO_SIZE*positionPrintHeightAI + TETRIMINO_SIZE * 2){
		window.cancelAnimationFrame(stopDrawMoveTextIdAI);
		clearMoveTextAIWindow();
		moveTextFlagAI = 0;
		moveTextHeightCountAI = 0;
		return;
	}
	window.requestAnimationFrame(drawMoveTextAI);
}

function drawText(){
	let tSpinMiniWidth = 0;
	let width = 0,height = 0;

    clearTextPlayerWindow();

    //表示位置調整
	if(drawTextTimeCount == 0){
		if(additionGameScore >= 100 && additionGameScore <= 999){
			printAdditionScoreAdjustment = 0;
		}else if(additionGameScore >= 1000 && additionGameScore <= 9999){
			printAdditionScoreAdjustment = -7;
		}else if(additionGameScore >= 10000 && additionGameScore <= 99999){
			printAdditionScoreAdjustment = -11;
		}else{
			printAdditionScoreAdjustment = -15;
		}
	}
	
	//AI対戦の際に加算スコア等をずらして表示する
	if(aiFlag == 1){
		width = -280;
		height = -30;
	}
	
    //斜めに変更
	textPlayerWindow.save();
	textPlayerWindow.translate(parseInt(canvasTextPlayer.width / 2), parseInt(canvasTextPlayer.height / 2));
	textPlayerWindow.rotate(-(Math.PI/32));
	
    //加算スコア
	textPlayerWindow.font="23px serif";
	textPlayerWindow.fillStyle="#FFFFEE";//背景塗りつぶし
	textPlayerWindow.fillRect(-115 + width,28 + height,-85,-15);
	textPlayerWindow.fillStyle = "#A9A9A9";//影
	textPlayerWindow.fillText("+" + additionGameScore,-190 + printAdditionScoreAdjustment + 2 + width,25 + 2 + height);
	textPlayerWindow.fillStyle = COLOR_BLACK;//テキスト
	textPlayerWindow.fillText("+" + additionGameScore,-190 + printAdditionScoreAdjustment + width,25 + height);

    //T-Spin   T-Spin   T-Spin   T-Spin   T-Spin
    // Single   Double   Triple   Mini     Double  Mini

    //TSpin
	if(tSpinFlag == 1 || tSpinMiniFlag == 1){
        //「T-Spin」部分を描画
		textPlayerWindow.font="20px serif";
		textPlayerWindow.fillStyle="#FFABCE";//背景塗りつぶし
		textPlayerWindow.fillRect(-140 + width,91 + height,-75,-15);
		textPlayerWindow.fillStyle = "#A9A9A9";//影
		textPlayerWindow.fillText("T-Spin",-213 + 2 + width,87 + 2 + height);
		textPlayerWindow.fillStyle = "#FF0000";//テキスト
		textPlayerWindow.fillText("T-Spin",-213 + width,87 + height);

        //「T-Spin」以外の下の部分を描画
		textPlayerWindow.fillStyle="#FFABCE";//背景塗りつぶし
		textPlayerWindow.fillRect(-128 + width,105 + height,-75,-15);

		if(printTSpinKind == "Mini"){//T-Spin Miniなら(1パターン)
            tSpinMiniWidth = 12;//Miniの場合少し右にずらす
			textPlayerWindow.fillStyle = "#008000";//文字を緑にする
		}else{//T-Spin Single、T-Spin Double、T-Spin-Tripleなら(3パターン)
			textPlayerWindow.fillStyle = "#FF0000";//文字を赤にする
		}
		textPlayerWindow.fillText(printTSpinKind,-200 + tSpinMiniWidth + width,102 + height);//テキスト		
        textPlayerWindow.fillStyle = "#A9A9A9";//影
		textPlayerWindow.fillText(printTSpinKind,-200 + tSpinMiniWidth + 2 + width,102 + 2 + height);

        //T-Spin Double Miniは、他の4パターンと比べて右側に新たにMiniの部分を拡張して描画する
		if(tSpinMiniFlag == 1 && printTSpinKind != "Mini"){//T-Spin Double Miniなら(1パターン)
			textPlayerWindow.fillStyle="#CBFFD3";//背景塗りつぶし
			textPlayerWindow.fillRect(-110 + width,90 + height,-35,-15);
			textPlayerWindow.fillRect(-100 + width,105 + height,-35,-15);
			textPlayerWindow.font="16px serif";
			textPlayerWindow.fillStyle = "#A9A9A9";//影
			textPlayerWindow.fillText("Mini",-147 + 2 + width,92 + 2 + height);
			textPlayerWindow.fillStyle = "#008000";//テキスト
			textPlayerWindow.fillText("Mini",-147 + width,92 + height);
		}
	}

    //Back To Back
	if(backToBackFlagCounter >= 2){
		textPlayerWindow.font="20px serif";
		textPlayerWindow.fillStyle="#A7F1FF";//背景塗りつぶし
		textPlayerWindow.fillRect(-155 + width,149 + height,-63,-15);
		textPlayerWindow.fillStyle = "#A9A9A9";//影
		textPlayerWindow.fillText("Back",-213 + 2 + width,145 + 2 + height);
		textPlayerWindow.fillStyle = "#0000FF";//テキスト
		textPlayerWindow.fillText("Back",-213 + width,145 + height);

		textPlayerWindow.fillStyle="#A7F1FF";//背景塗りつぶし
		textPlayerWindow.fillRect(-123 + width,164 + height,-80,-15);
		textPlayerWindow.fillStyle = "#A9A9A9";//影
		textPlayerWindow.fillText("to Back",-200 + 2 + width,160 + 2 + height);
		textPlayerWindow.fillStyle = "#0000FF";//テキスト
		textPlayerWindow.fillText("to Back",-200 + width,160 + height);
	}

    //コンボ
	textPlayerWindow.font="20px serif";
	textPlayerWindow.fillStyle="#FFC7AF";//背景塗りつぶし
	textPlayerWindow.fillRect(-130 + width,220 + height,-85,-15);
	textPlayerWindow.fillStyle = "#A9A9A9";//影
	textPlayerWindow.fillText(tmpRenCount + "combo",-210 + 2 + width,215 + 2 + height);
	textPlayerWindow.fillStyle = "#FF4F02";//テキスト
	textPlayerWindow.fillText(tmpRenCount + "combo",-210 + width,215 + height);

    //隠しコマンドの加算倍率
	if(hiddenCommand_mysteriousAddPoints_Flag == 1){
		textPlayerWindow.font="20px serif";
		if(mysteriousAddPoints != 1){
			textPlayerWindow.fillStyle="#FFFFEE";//背景塗りつぶし
			textPlayerWindow.fillRect(-130 + width,-40 + height,-50,-25);
			textPlayerWindow.fillStyle = "#A9A9A9";//影
			textPlayerWindow.fillText("×" + mysteriousAddPoints,-180 + 2 + width,-45 + 2 + height);
			textPlayerWindow.fillStyle = COLOR_BLACK;//テキスト
			textPlayerWindow.fillText("×" + mysteriousAddPoints,-180 + width,-45 + height);
		}
	}

	textPlayerWindow.restore();//縦に戻す

    //全消し
	if(allClearFlag == 1){//全消しされたら
		textPlayerWindow.font="50px serif";
		textPlayerWindow.fillStyle = "#A9A9A9";//影
		textPlayerWindow.fillText("PERFECT",186 + 4,TETRIMINO_SIZE*12 + 4);
		textPlayerWindow.fillText("CLEAR!",211 + 4,TETRIMINO_SIZE*14 + 4);
		textPlayerWindow.fillStyle = "#FF0461";//テキスト
		textPlayerWindow.fillText("PERFECT",186,TETRIMINO_SIZE*12);
		textPlayerWindow.fillText("CLEAR!",211,TETRIMINO_SIZE*14);
		textPlayerWindow.lineWidth = 1.5;
		textPlayerWindow.strokeStyle = "#000000";//枠
		textPlayerWindow.strokeText("PERFECT",186,TETRIMINO_SIZE*12);
		textPlayerWindow.strokeText("CLEAR!",211,TETRIMINO_SIZE*14);
	}

	drawTextTimeCount++;
	if(drawTextTimeCount <=60){//ここの数字で表示時間の長さを変更する
		window.requestAnimationFrame(drawText);
	}else{
		window.cancelAnimationFrame(stopDrawTextId);
		clearTextPlayerWindow();
		drawTextTimeCount = 0;
		allClearFlag = 0;
		tSpinMiniFlag = 0;
		tSpinFlag = 0;
		return;
	}
}

function drawTextAI(){
	let tSpinMiniWidth = 0
	let width = 0,height = 0;

    clearTextAIWindow();

    //表示位置調整
	if(drawTextTimeCountAI == 0){
		if(additionGameScoreAI >= 100 && additionGameScoreAI <= 999){
			printAdditionScoreAdjustmentAI = 0;
		}else if(additionGameScoreAI >= 1000 && additionGameScoreAI <= 9999){
			printAdditionScoreAdjustmentAI = -7;
		}else if(additionGameScoreAI >= 10000 && additionGameScoreAI <= 99999){
			printAdditionScoreAdjustmentAI = -11;
		}else{
			printAdditionScoreAdjustmentAI = -15;
		}
	}
	
	//AI対戦の際に加算スコア等をずらして表示する
	if(aiFlag == 1){
		width = 280;
		height = 30;
	}
	
    //斜めに変更
	textAIWindow.save();
	textAIWindow.translate(parseInt(canvasTextAI.width / 2), parseInt(canvasTextAI.height / 2));
	textAIWindow.rotate(-(Math.PI/32));

	//加算スコア
	textAIWindow.font="23px serif";
	textAIWindow.fillStyle="#FFFFEE";//背景塗りつぶし
	textAIWindow.fillRect(-115 + width,28 + height,-85,-15);
	textAIWindow.fillStyle = "#A9A9A9";//影
	textAIWindow.fillText("+" + additionGameScoreAI,-190 + printAdditionScoreAdjustmentAI + 2 + width,25 + 2 + height);
	textAIWindow.fillStyle = COLOR_BLACK;//テキスト
	textAIWindow.fillText("+" + additionGameScoreAI,-190 + printAdditionScoreAdjustmentAI + width,25 + height);

    //T-Spin   T-Spin   T-Spin   T-Spin   T-Spin
    // Single   Double   Triple   Mini     Double  Mini

    //TSpin
	if(tSpinFlagAI == 1 || tSpinMiniFlagAI == 1){
		//「T-Spin」部分を描画
        textAIWindow.font="20px serif";
		textAIWindow.fillStyle="#FFABCE";//背景塗りつぶし
		textAIWindow.fillRect(-140 + width,91 + height,-75,-15);
		textAIWindow.fillStyle = "#A9A9A9";//影
		textAIWindow.fillText("T-Spin",-213 + 2 + width,87 + 2 + height);
		textAIWindow.fillStyle = "#FF0000";//テキスト
		textAIWindow.fillText("T-Spin",-213 + width,87 + height);

        //「T-Spin」以外の下の部分を描画
		textAIWindow.fillStyle="#FFABCE";//背景塗りつぶし
		textAIWindow.fillRect(-128 + width,105 + height,-75,-15);

		if(printTSpinKindAI == "Mini"){//T-Spin Miniなら(1パターン)
			tSpinMiniWidth = 12;//Miniの場合少し右にずらす
			textAIWindow.fillStyle = "#008000";//文字を緑にする
		}else{//T-Spin Single、T-Spin Double、T-Spin-Tripleなら(3パターン)
			textAIWindow.fillStyle = "#FF0000";//文字を赤にする
		}
        textAIWindow.fillStyle = "#A9A9A9";//影
        textAIWindow.fillText(printTSpinKindAI,-200 + tSpinMiniWidth + 2 + width,102 + 2 + height);//テキスト
		textAIWindow.fillText(printTSpinKindAI,-200 + tSpinMiniWidth + width,102 + height);
		
		//T-Spin Double Miniは、他の4パターンと比べて右側に新たにMiniの部分を拡張して描画する
		if(tSpinMiniFlagAI == 1 && printTSpinKindAI != "Mini"){//T-Spin Double Miniなら(1パターン)
			textAIWindow.fillStyle="#CBFFD3";//背景塗りつぶし
			textAIWindow.fillRect(-110 + width,90 + height,-35,-15);
			textAIWindow.fillRect(-100 + width,105 + height,-35,-15);
			textAIWindow.font="16px serif";
			textAIWindow.fillStyle = "#A9A9A9";//影
			textAIWindow.fillText("Mini",-147 + 2 + width,92 + 2 + height);
			textAIWindow.fillStyle = "#008000";//テキスト
			textAIWindow.fillText("Mini",-147 + width,92 + height);
		}
	}

    //Back To Back
	if(backToBackFlagCounterAI >= 2){
		textAIWindow.font="20px serif";
		textAIWindow.fillStyle="#A7F1FF";//背景塗りつぶし
		textAIWindow.fillRect(-155 + width,149 + height,-63,-15);
		textAIWindow.fillStyle = "#A9A9A9";//影
		textAIWindow.fillText("Back",-213 + 2 + width,145 + 2 + height);
		textAIWindow.fillStyle = "#0000FF";//テキスト
		textAIWindow.fillText("Back",-213 + width,145 + height);
		
		textAIWindow.fillStyle="#A7F1FF";//背景塗りつぶし
		textAIWindow.fillRect(-123 + width,164 + height,-80,-15);
		textAIWindow.fillStyle = "#A9A9A9";//影
		textAIWindow.fillText("to Back",-200 + 2 + width,160 + 2 + height);
		textAIWindow.fillStyle = "#0000FF";//テキスト
		textAIWindow.fillText("to Back",-200 + width,160 + height);
	}

    //コンボ
	textAIWindow.font="20px serif";
	textAIWindow.fillStyle="#FFC7AF";//背景塗りつぶし
	textAIWindow.fillRect(-130 + width,220 + height,-85,-15);
	textAIWindow.fillStyle = "#A9A9A9";//影
	textAIWindow.fillText(tmpRenCountAI + "combo",-210 + 2 + width,215 + 2 + height);
	textAIWindow.fillStyle = "#FF4F02";//テキスト
	textAIWindow.fillText(tmpRenCountAI + "combo",-210 + width,215 + height);

	textAIWindow.restore();//縦に戻す
	
    //全消し
	if(allClearFlagAI == 1){//全消しされたら
		textAIWindow.font="50px serif";
		textAIWindow.fillStyle = "#A9A9A9";//影
		textAIWindow.fillText("PERFECT",170 + 4 + SCREEN_WIDTH_DRAW_AI,TETRIMINO_SIZE*12 + 4);//AI用に右にずらす
		textAIWindow.fillText("CLEAR!",195 + 4 + SCREEN_WIDTH_DRAW_AI,TETRIMINO_SIZE*14 + 4);
		textAIWindow.fillStyle = "#FF0461";//テキスト
		textAIWindow.fillText("PERFECT",170 + SCREEN_WIDTH_DRAW_AI,TETRIMINO_SIZE*12);
		textAIWindow.fillText("CLEAR!",195 + SCREEN_WIDTH_DRAW_AI,TETRIMINO_SIZE*14);
		textAIWindow.lineWidth = 1.5;//枠
		textAIWindow.strokeStyle = "#000000";
		textAIWindow.strokeText("PERFECT",170 + SCREEN_WIDTH_DRAW_AI,TETRIMINO_SIZE*12);
		textAIWindow.strokeText("CLEAR!",195 + SCREEN_WIDTH_DRAW_AI,TETRIMINO_SIZE*14);
	}

	drawTextTimeCountAI++;
	if(drawTextTimeCountAI <=60){//ここの数字で表示時間の長さを変更する
		window.requestAnimationFrame(drawTextAI);
	}else{
		window.cancelAnimationFrame(stopDrawTextIdAI);
		clearTextAIWindow();
		drawTextTimeCountAI = 0;
		allClearFlagAI = 0;
		tSpinMiniFlagAI = 0;
		tSpinFlagAI = 0;
		return;
	}
}

async function deleteFlowField(){
	let h,w;

    currentScreenState = screenState.FLOW;

    playSoundKeyboard(soundType.TETRIMINO_FLOW);//流れる音

    if(gameResultState == gameResult.AI_WIN){//プレイヤーの負け、AIの勝ち
        for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
            await sleep(50);
            for (w = 1; w < FIELD_WIDTH -1; w++) {
                playField[h][w] = blockType.FREE;
            }
            
            await drawFieldAllAsync();
        }
    }else if(gameResultState == gameResult.PLAYER_WIN){//プレイヤーの勝ち、AIの負け
        for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
            await sleep(50);
            for (w = 1; w < FIELD_WIDTH -1; w++) {
                playFieldAI[h][w] = blockType.FREE;
            }
            
            await drawFieldAllAsync();
        }
    }

	updateRanking();
	drawGameOverScreen();
}

/*----------------------------------------------------------------------------------------------------*/

//ゲーム画面以外の静止画面を描画する関数

/*----------------------------------------------------------------------------------------------------*/

function drawTetrisLogo(){
    let width = 0;

    if(aiFlag == 1){
        width = SCREEN_WIDTH_TEXT_AI;
    }

    allWindow.font="150px cursive";
    allWindow.fillStyle=COLOR_RED;
    allWindow.fillText("T",11 + width,210);
    allWindow.fillStyle=COLOR_ORANGE;
    allWindow.fillText("E",110 + width,210);
    allWindow.fillStyle=COLOR_YELLOW;
    allWindow.fillText("T",198 + width,210);
    allWindow.fillStyle=COLOR_GREEN;
    allWindow.fillText("R",300 + width,210);
    allWindow.fillStyle=COLOR_LIGHTBLUE;
    allWindow.fillText("I",388 + width,210);
    allWindow.fillStyle=COLOR_PURPLE;
    allWindow.fillText("S",458 + width,210);

    if(aiFlag == 1){
        allWindow.font="50px cursive";
        allWindow.fillStyle=COLOR_BLUE;
        allWindow.fillText("v",400 + width,267);
        allWindow.fillText("s",420 + width,267);

        allWindow.font="50px cursive";
        allWindow.fillStyle=COLOR_BLUE;
        allWindow.fillText("A",450 + width,270);
        allWindow.fillText("I",485 + width,270);
    }
}

function drawTitleScreen(){
	clearAllWindow();
	drawTetrisLogo();

    allWindow.fillStyle=COLOR_BLACK;
	allWindow.font="20px serif";

	if(aiFlag == 0){
		allWindow.fillText("1.START",245,410);
		allWindow.fillText("2.RANKING",245,435);
		allWindow.fillText("3.HELP",245,460);

        allWindow.font="14px serif";
        allWindow.fillText("※キーボードで操作してください。",200,520);
	}else if(aiFlag == 1){
		allWindow.fillText("1.AIと対戦",245 + SCREEN_WIDTH_TEXT_AI,410);
        allWindow.font="14px serif";
        allWindow.fillText("※キーボードで操作してください。",480,500);
    }

	if(DEBUG_MODE == 1){
		drawDebug();//タイトル画面でデバッグ画面表示
	}
}

function drawHelpScreen(){
	clearAllWindow();

	allWindow.fillStyle=COLOR_BLACK;
	allWindow.font="20px serif";

	allWindow.fillText("<ゲームのルール>",10,40);
	allWindow.fillText("縦20行横10列のフィールドに、7種類のテトリミノが上部から",10,65);
	allWindow.fillText("ランダムに落下してくる。それらを回転させたり左右に移動さ",8,90);
	allWindow.fillText("せたりして操作し、フィールドに敷き詰める。横一列揃うとそ",8,115);
	allWindow.fillText("の行が消去され点数が加算される。10ライン消去するとレベル",8,140);
	allWindow.fillText("アップし、落下速度が徐々に速くなる。NEXTには次以降出現",8,165);
	allWindow.fillText("するテトリミノが表示され、HOLDは落下中のテトリミノをキ",8,190);
	allWindow.fillText("ープし、必要なときに交換できる。プレイヤーは、できるだけ",8,215);
	allWindow.fillText("長い時間プレイを続けることを目標とする。",8,240);
	
	allWindow.fillText("<点数の加算方式>",10,290);
	allWindow.fillText("1列消去で100点、2列同時消去で400点、3列同時消去で900点、",8,315);
	allWindow.fillText("4列同時消去で1600点が加算される。それらの素点から、全消",8,340);
	allWindow.fillText("しで10倍、レベル数、連鎖数がさらに加算される。",8,365);

	allWindow.fillText("<操作方法>",8,415);
	allWindow.fillText("左移動(左矢印キー)、右移動(右矢印キー)、下移動(下矢印キー",8,440);
	allWindow.fillText(")、高速下移動(K)、右回転(上矢印キー)、左回転(L)、ホールド",8,465);
	allWindow.fillText("(H)、一時停止(W)、強制終了(Q)",8,490);

	allWindow.font="12px serif";
	allWindow.fillText("(隠しコマンドもたくさんあるよ！)",315,490);

	allWindow.font="20px serif";
	allWindow.fillText("0.戻る",260,650);
}

function drawRankingScreen(){
	let i,rankingWidth=0;
	let right = 0;

	clearAllWindow();

	allWindow.fillStyle = COLOR_BLACK;
	allWindow.font="20px serif";
	allWindow.fillText("0.戻る",260,650);

	allWindow.fillStyle = COLOR_DARK_ORANGE;
	allWindow.fillText("ランキング",238,100);

	allWindow.fillStyle = COLOR_BLACK;
	allWindow.fillText("順位        点数                          日時                  消去ライン数",37,170);
	
	for(i=0;i<9;i++){
		allWindow.fillText(i+1+"位",40,200+rankingWidth);
		rankingWidth = rankingWidth + 25;
	}
	//10位だけ別で書いて桁を揃える
	allWindow.fillText("10位",29,200+rankingWidth);

	rankingWidth = 0;
	//右揃えにする
	for(i=0;i<10;i++){
		if(localStorageRankingTetris[i][0] <= 999999999 && localStorageRankingTetris[i][0]>=100000000){
			right = 0;
		}else if(localStorageRankingTetris[i][0] <= 99999999 && localStorageRankingTetris[i][0]>=10000000){
			right = 11;
		}else if(localStorageRankingTetris[i][0] <= 9999999 && localStorageRankingTetris[i][0]>=1000000){
			right = 22;
		}else if(localStorageRankingTetris[i][0] <= 999999 && localStorageRankingTetris[i][0]>=100000){
			right = 33;
		}else if(localStorageRankingTetris[i][0] <= 99999 && localStorageRankingTetris[i][0]>=10000){
			right = 44;
		}else if(localStorageRankingTetris[i][0] <= 9999 && localStorageRankingTetris[i][0]>=1000){
			right = 55;
		}else if(localStorageRankingTetris[i][0] <= 999 && localStorageRankingTetris[i][0]>=100){
			right = 66;
		}else if(localStorageRankingTetris[i][0] <= 99 && localStorageRankingTetris[i][0]>=10){
			right = 77;
		}else if(localStorageRankingTetris[i][0] <= 9 && localStorageRankingTetris[i][0]>=0){
			right = 88;
		}
		if(localStorageRankingTetris[i][0] != 0){
			allWindow.fillText(localStorageRankingTetris[i][0],90 + right,200+rankingWidth);
		}else{
			allWindow.fillText("-",48 + right,200+rankingWidth);
		}
		rankingWidth = rankingWidth + 25;
	}
	//以下のコードで右揃えを試したが出来なかった
	//allWindow.fillText(('000000000'+gameScore).slice(-9),240,350);

	rankingWidth = 0;
	for(i=0;i<10;i++){
		if(localStorageRankingTetris[i][1] != 0){
			allWindow.fillText(localStorageRankingTetris[i][1],220,200+rankingWidth);
		}else{
			allWindow.fillText("                 -",220,200+rankingWidth);
		}
		
		rankingWidth = rankingWidth + 25;
	}

	rankingWidth = 0;
	for(i=0;i<10;i++){
		if(localStorageRankingTetris[i][3] <= 999 && localStorageRankingTetris[i][3]>=100){
			right = 0;
		}else if(localStorageRankingTetris[i][3] <= 99 && localStorageRankingTetris[i][3]>=10){
			right = 11;
		}else if(localStorageRankingTetris[i][3] <= 9 && localStorageRankingTetris[i][3]>=0){
			right = 22;
		}
		
		if(localStorageRankingTetris[i][3] != 0 || localStorageRankingTetris[i][1] != 0){
			allWindow.fillText(localStorageRankingTetris[i][3],470 + right,200+rankingWidth);
		}else{
			allWindow.fillText("-",482,200+rankingWidth);
		}
		
		rankingWidth = rankingWidth + 25;
	}
}

function drawAIMenuScreen(){
	clearAllWindow();
	drawTetrisLogo();

    allWindow.fillStyle=COLOR_BLACK;
	allWindow.font="20px serif";

    allWindow.fillText("0.戻る",620,500);

    allWindow.fillText("1.START",470,500);

    allWindow.fillText("レベル選択：",500,410);

    allWindow.font="14px serif";
    allWindow.fillText("※レベルは1～10まで選択可能です。",470,550);
    allWindow.font="20px serif";

    if(flashingArrowFlag == 1){
        if(aiLevel != 10){
            allWindow.fillText("↑",618,380);
        }
        if(aiLevel != 1){
            if(aiLevel == 10){//レベル10のときだけ少し右にずらして表示
                allWindow.fillText("↓",626,440);
            }else{
                allWindow.fillText("↓",618,440);
            }

        }
        flashingArrowFlag = 0;
    }else{
        flashingArrowFlag = 1;
    }

    allWindow.font="30px serif";
    allWindow.fillText(aiLevel,620,412);
}

async function drawCountDownScreen(){
    let i,width = 0;

    currentScreenState = screenState.COUNTDOWN;//状態をカウントダウンに遷移

    if(aiFlag == 1){
        width = SCREEN_WIDTH_DRAW_AI;
    }

    stopSoundKeyboard(soundType.TETRIS_MENU_BGM);//オルゴールを止める
	playSoundKeyboard(soundType.COUNT_DOWN);
    setTimeout(playSoundKeyboard,1000,soundType.TETRIS_MAIN_BGM);

    //最初のテトリミノを生成
    generateTetrimino(generateTetriminoTime.FIRST_TIME);
    if(aiFlag == 1){
        generateTetriminoAI(generateTetriminoTime.FIRST_TIME);
    }

    allWindow.clearRect(0,0,canvasTime.width,canvasTime.height);

    drawElapsedTime();//0:00:00

    for(i = 3; i >= 1; i--){
        drawFieldAllAsync();
        gameWindow.fillStyle=COLOR_BLACK;
        gameWindow.font="80px serif";
        if(aiFlag == 0){
            gameWindow.fillText(i,265,306);
        }else if(aiFlag == 1){
            gameWindow.fillText(i,265 + 16,306);//+16はお邪魔ブロックの差分
            gameWindow.fillText(i,265 + 16 + width,306);
        }
        await sleep(1000);
    }

    drawFieldAllAsync();
    gameWindow.fillStyle=COLOR_BLACK;
    gameWindow.font="50px serif";
    if(aiFlag == 0){
        gameWindow.fillText("START!",197,295);
    }else if(aiFlag == 1){
        gameWindow.fillText("START!",197 + 16,295);
        gameWindow.fillText("START!",197 + 16 + width,295);
    }

    await sleep(1000);

    generateTetrimino(generateTetriminoTime.FROM_THE_SECOND_TIME);
	setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
	if(aiFlag == 1){
        generateTetriminoAI(generateTetriminoTime.FROM_THE_SECOND_TIME);
		setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
	}

    currentScreenState = screenState.PLAYING;

	elapsedTimeCountTimer = setInterval(drawElapsedTime, 1000 );
	mainLoopTimer = setInterval( mainLoop, fallTime );
	drawLoopTimer = setInterval( drawFieldAllLoop, 50 );
	softDropJudgementTimer = setInterval( softDropJudgementLoop, 50 );

    if(aiFlag == 1){
        evaluationTimerAI = setTimeout( evaluationAI, generateTetriminoSpeed );
        mainLoopTimerAI = setInterval( mainLoopAI, fallTimeAI );
        //softDropJudgementTimerAI = setInterval( softDropJudgementLoopAI, 50 );
    }
}

function drawGameOverScreen(){
	let i,width = 0;
    
    //fillRectではなくclearRectのため、直接記述
	timeWindow.clearRect(0,0,canvasTime.width,canvasTime.height);
	gameWindow.clearRect(0,0,canvasGame.width,canvasGame.height);

	clearAllWindow();
	drawTetrisLogo();

    if(aiFlag == 1){
        width = SCREEN_WIDTH_TEXT_AI;
    }

    allWindow.fillStyle=COLOR_BLACK;
    allWindow.font="25px serif";
    allWindow.fillText("RESULT",240 + width,275);

    allWindow.font="20px serif";
    if(aiFlag == 0){
        allWindow.fillText("今回のスコア",230,350);
        allWindow.fillText(('000000000'+gameScore).slice(-9),240,375);
        allWindow.fillText("ハイスコア",240,425);
        allWindow.fillText(('000000000'+localStorageRankingTetris[0][0]).slice(-9),240,450);
    }else if(aiFlag == 1){
        allWindow.fillText("今回のスコア",260,375);
		allWindow.fillText(('000000000'+gameScore).slice(-9),270,400);
		allWindow.fillText("ハイスコア",270,450);
		allWindow.fillText(('000000000'+localStorageRankingTetris[0][0]).slice(-9),270,475);

        allWindow.fillText("今回のスコア",760,375);
		allWindow.fillText(('000000000'+gameScoreAI).slice(-9),770,400);
		allWindow.fillText("ハイスコア",770,450);
		allWindow.fillText("999999999",770,475);
        
        allWindow.font="25px serif";
        if(gameResultState == gameResult.AI_WIN){
            allWindow.fillStyle=COLOR_LOSE;
            allWindow.fillText("YOU LOSE...",250,325);
            allWindow.fillStyle=COLOR_RED;
            allWindow.fillText("AI WIN！",770,325);
        }else if(gameResultState == gameResult.PLAYER_WIN){
            allWindow.fillStyle=COLOR_RED;
            allWindow.fillText("YOU WIN！",255,325);
            allWindow.fillStyle=COLOR_LOSE;
            allWindow.fillText("AI LOSE...",760,325);
        }
    }

    allWindow.fillStyle=COLOR_BLACK;
    allWindow.font="20px serif";
    if(gameScore == 0){
		allWindow.fillText("0点のため、ランキングは更新されませんでした。",70 + width,550);
	}else if(gameScore != 0){
        for(i = localStorageRankingTetris.length - 2; i >= 0; i--){//-2からスタートしているのは101位にランクインと表示させないため
            if(gameScore == localStorageRankingTetris[i][0]){
                allWindow.fillText(i+1+"位にランクイン！",207 + width,550);
                break;
            }
        }
    }
    /*if(gameScore == localStorageRankingTetris[0][0] && gameScore != 0){
        allWindow.fillStyle = COLOR_ORANGE;
        allWindow.fillText("ハイスコアを更新しました！",190,525);
    }*/

    allWindow.fillText("1.もう一度遊ぶ",220 + width,625);

	playSoundKeyboard(soundType.GAME_OVER_BGM);//ゲームオーバーの音

    if(currentScreenState == screenState.FLOW || currentScreenState == screenState.QUIT){//強制終了してQUITの状態ならGAMEOVERに戻す
        currentScreenState = screenState.GAMEOVER;
    }

    autoRestartAILearning();
}

/*----------------------------------------------------------------------------------------------------*/

//AIに関する関数

/*----------------------------------------------------------------------------------------------------*/

function autoRestartAILearning(){
    //自動で再プレイ
	if(AI_LEARNING_FLAG == 1){
		if(playCountAI < 10){//何回同じ重みで試行させるか

			sumClearLineCountAI = sumClearLineCountAI + clearLineCountAI;
			if(playCountAI == 1 || clearLineCountAI > maxClearLineCountAI){
				maxClearLineCountAI = clearLineCountAI;
			}
			if(playCountAI == 1 || clearLineCountAI < minClearLineCountAI){
				minClearLineCountAI = clearLineCountAI;
			}
			sumTetrisCountAI = sumTetrisCountAI + tetrisCountAI;
			sumPerfectClearCountAI = sumPerfectClearCountAI + perfectClearCountAI;
	
			//次回のカウントダウン時に0にリセットにして表示
			clearLineCountAI = 0;
			tetrisCountAI = 0;
			perfectClearCountAI = 0;
	
			playCountAI++;
	
			if(DEBUG_MODE == 1){
				drawDebug();
			}
	
			currentScreenState = screenState.TITLE;//状態をタイトルに遷移
			variableReset();

			drawCountDownScreen();//カウントダウン画面に遷移
		}else{
	
			//最後に更新して終了
			sumClearLineCountAI = sumClearLineCountAI + clearLineCountAI;
			if(clearLineCountAI > maxClearLineCountAI){
				maxClearLineCountAI = clearLineCountAI;
			}
			if(clearLineCountAI < minClearLineCountAI){
				minClearLineCountAI = clearLineCountAI;
			}
			sumTetrisCountAI = sumTetrisCountAI + tetrisCountAI;
			sumPerfectClearCountAI = sumPerfectClearCountAI + perfectClearCountAI;
	
			console.log(holeCountCoefficient,holeUpTetriminoCountCoefficient,holeColumnCountCoefficient,sumHeightCoefficient,maxHeightCoefficient,differenceHeightSumCoefficient,putTetriminoHeightCoefficient,rowChangeCountCoefficient,columnChangeCountCoefficient,completeLineCountCoefficient,sumClearLineCountAI,sumClearLineCountAI/10,maxClearLineCountAI,minClearLineCountAI,sumTetrisCountAI,sumPerfectClearCountAI)
	
			clearLineCountAI = 0;
			tetrisCountAI = 0;
			perfectClearCountAI = 0;
	
			endEvaluationFlag = 1;
	
			//alert(numberOfTrials+"個目の個体の適応度の計算が終了しました")
	
			if(numberOfTrials < 10){//個体作成回数
				playCountAI = 1;
				numberOfTrials++;
				endEvaluationFlag = 0;
	
				sumClearLineCountAI = 0;
				maxClearLineCountAI = 0;
				minClearLineCountAI = 0;
				sumTetrisCountAI = 0;
				sumPerfectClearCountAI = 0;
	
				if(AI_LEARNING_FLAG == 1){
					if(ONE_GENERATION_FLAG == 1){
						holeCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						holeUpTetriminoCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						holeColumnCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						sumHeightCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						maxHeightCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						differenceHeightSumCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						putTetriminoHeightCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						rowChangeCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						columnChangeCountCoefficient = (Math.round(Math.random() * 10000) / 100) * -1;
						completeLineCountCoefficient = (Math.round(Math.random() * 10000) / 100);
					}else if(ONE_GENERATION_FLAG == 0){
						holeCountCoefficient = geneList[numberOfTrials - 1][0];
						holeUpTetriminoCountCoefficient = geneList[numberOfTrials - 1][1];
						holeColumnCountCoefficient = geneList[numberOfTrials - 1][2];
						sumHeightCoefficient = geneList[numberOfTrials - 1][3];
						maxHeightCoefficient = geneList[numberOfTrials - 1][4];
						differenceHeightSumCoefficient = geneList[numberOfTrials - 1][5];
						putTetriminoHeightCoefficient = geneList[numberOfTrials - 1][6];
						rowChangeCountCoefficient = geneList[numberOfTrials - 1][7];
						columnChangeCountCoefficient = geneList[numberOfTrials - 1][8];
						completeLineCountCoefficient = geneList[numberOfTrials - 1][9];
					}
				}
	
				if(DEBUG_MODE == 1){
					drawDebug();
				}
	
				currentScreenState = screenState.TITLE;//状態をタイトルに遷移
				variableReset();

				drawCountDownScreen();//カウントダウン画面に遷移
			}else{
				clearLineCountAI = 0;
				tetrisCountAI = 0;
				perfectClearCountAI = 0;
	
				//alert("全ての個体の適応度の計算が終了しました")
			}
		}
	}
}

function collisionCheckTetriminoEvaluation(positionX,positionY,tmpTetrimino) {
	let h,w;
	for (h = 0; h < TETRIMINO_HEIGHT; h++) {
		for (w = 0; w < TETRIMINO_WIDTH; w++) {
			if (tmpTetrimino[h][w] == 1) {//もし4×4のうち、描画されていているマスならば
				if (tmpEvaluationField[positionY + h][positionX + w] != blockType.FREE) {//移動させたい先がFREEでないのならば
					return 1;//移動できない
				}
			}
		}
	}
	return 0;//移動できる
}

function evaluationBoardScore(){
	let h,w;

	let holeFlag = 0,holeCount = 0;
	let holeUpTetriminoCount = 0;
	let holeColumnCount = 0;

	let sumHeight = 0,maxHeight = 0;
	let heightList = [0,0,0,0,0,0,0,0,0,0];
	let differenceHeightSum = 0;

	let putTetriminoHeight = 0;

	let rowBlockList = [0,0,0,0,0,0,0,0,0,0];
	let rowChangeCount = 0;
	let columnBlockList = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	let columnChangeCount = 0;

	let blockCount = 0,completeLineCount = 0;

	//穴の数
	for (w = 1; w < FIELD_WIDTH -1; w++) {
		for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
			if(holeFlag == 0 && (tmpEvaluationField[h][w] == 1 || tmpEvaluationField[h][w] == 3)){
				holeFlag = 1;
			}else if(holeFlag == 1 && tmpEvaluationField[h][w] == 0){
				holeCount++;
			}
		}
		holeFlag = 0;
	}

	//穴の上のブロック数
	holeFlag = 0;
	for (w = 1; w < FIELD_WIDTH -1; w++) {
		for (h = FIELD_HEIGHT_REAL - 2; h >= 0; h--) {
			if(holeFlag == 0 && tmpEvaluationField[h][w] == 0){
				holeFlag = 1;
			}else if(holeFlag == 1 && (tmpEvaluationField[h][w] == 1 || tmpEvaluationField[h][w] == 3)){
				holeUpTetriminoCount++;
			}
		}
		holeFlag = 0;
	}

	//1つ以上穴のある列数
	holeFlag = 0;
	for (w = 1; w < FIELD_WIDTH -1; w++) {
		for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
			if(holeFlag == 0 && (tmpEvaluationField[h][w] == 1 || tmpEvaluationField[h][w] == 3)){
				holeFlag = 1;
			}else if(holeFlag == 1 && tmpEvaluationField[h][w] == 0){
				holeColumnCount++;
				break;
			}
		}
		holeFlag = 0;
	}

	//高さ総合計、最大の高さ、各列の右隣の列との高低差の絶対値の合計(凸凹数)
	for (w = 1; w < FIELD_WIDTH -1; w++) {
		for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
			if(tmpEvaluationField[h][w] != 0){
				sumHeight = sumHeight + (FIELD_HEIGHT_REAL - 1 - h);
				heightList[w - 1] = FIELD_HEIGHT_REAL - 1 - h;
				break;
			}
		}
	}
	maxHeight = Math.max(...heightList);
	differenceHeightSum = 0;
	for (w = 1; w < FIELD_WIDTH -2; w++) {
		differenceHeightSum = differenceHeightSum + (Math.abs(heightList[w - 1] - heightList[w]));
	}

	//置いたテトリミノの高さ
	loop: for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
            if(tmpEvaluationField[h][w] == 1){
				putTetriminoHeight = FIELD_HEIGHT_REAL - 1 - h;
				break loop;
			}
		}
    }

	//横方向にスキャンしたときセルの内容が変わる回数
	for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
        for (w = 1; w < FIELD_WIDTH -1; w++) {
			if(tmpEvaluationField[h][w] == 1 || tmpEvaluationField[h][w] == 3){
				rowBlockList[w - 1] = 1;
			}else{
				rowBlockList[w - 1] = 0;
			}
			
		}
		for (w = 1; w < FIELD_WIDTH -2; w++) {
			if(rowBlockList[w - 1] != rowBlockList[w]){
				rowChangeCount++;
			}
		}
    }

	//縦方向にスキャンしたときセルの内容が変わる回数
	for (w = 1; w < FIELD_WIDTH -1; w++) {
		for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
			if(tmpEvaluationField[h][w] == 1 || tmpEvaluationField[h][w] == 3){
				columnBlockList[h] = 1;
			}else{
				columnBlockList[h] = 0;
			}
			
		}
		for (h = 0; h < FIELD_HEIGHT_REAL -2; h++) {
			if(columnBlockList[h] != columnBlockList[h + 1]){
				columnChangeCount++;
			}
		}
	}

	//消去行数
	for (h = 0; h < FIELD_HEIGHT_REAL -1; h++) {
		for (w = 1; w < FIELD_WIDTH -1; w++) {
			if(tmpEvaluationField[h][w] == 1 || tmpEvaluationField[h][w] == 3){
				blockCount++;
			}
		}
		if(blockCount == 10){
			completeLineCount++;
		}
		blockCount = 0;
	}
	completeLineCount = completeLineCount * completeLineCount;

	/*
	//穴の数(holeCount)
	//穴の上のブロック数(holeUpTetriminoCount)
	//1つ以上穴のある列数(holeColumnCount)
	//高さ総合計(sumHeight)
	//最大の高さ(maxHeight)
	//各列の右隣の列との高低差の絶対値の合計(凸凹数)(differenceHeightSum)
	//置いたテトリミノの高さ(putTetriminoHeight)
	//横方向にスキャンしたときセルの内容が変わる回数(rowChangeCount)
	//縦方向にスキャンしたときセルの内容が変わる回数(columnChangeCount)
	//消去行数(completeLineCount)
	*/
	return (holeCount * holeCountCoefficient) + (holeUpTetriminoCount * holeUpTetriminoCountCoefficient) + (holeColumnCount * holeColumnCountCoefficient) + (sumHeight * sumHeightCoefficient) + (maxHeight * maxHeightCoefficient) + (differenceHeightSum * differenceHeightSumCoefficient) + (putTetriminoHeight * putTetriminoHeightCoefficient) + (rowChangeCount * rowChangeCountCoefficient) + (columnChangeCount * columnChangeCountCoefficient) + (completeLineCount * completeLineCountCoefficient);
}

async function evaluationAI(){
	let startX=[
		[1,-1,1,0],
		[0,0,0,0],
		[1,0,1,1],
		[1,0,1,1],
		[1,0,1,1],
		[1,0,1,1],
		[1,0,1,1]
	];

	let endX=[
		[7,8,7,9],
		[8,8,8,8],
		[8,8,8,9],
		[8,8,8,9],
		[8,8,8,9],
		[8,8,8,9],
		[8,8,8,9],
	];

	let currentEvaluationTetriminoPositionY;

	let i,j,h,w;
	let collisionCheck;

	let maxI = 0;
	let maxJ = 0;

	let sideI,rotateJ;

	let maxScore  = -999999;
	let evaluationScore = 0;

	if(currentScreenState == screenState.PLAYING && loopLockFlagAI == 0) {
	
		//AIのフィールドから固定されているテトリミノをコピー
		for (h = 0; h < FIELD_HEIGHT_REAL - 1; h++) {
			for (w = 1; w < FIELD_WIDTH - 1; w++) {
				if(playFieldAI[h][w] >= 9 && playFieldAI[h][w] <= 15 || playFieldAI[h][w] == blockType.GARBAGE){
					tmpEvaluationField[h][w] = 3;
				}else{
					tmpEvaluationField[h][w] = 0;
				}
			}
		}

		//現在のテトリミノ4つの角度
		for (j = 0; j < TETRIMINO_ANGLES; j++) {

			//tmpを削除
			for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					tmpEvaluationTetrimino[h][w] = 0;
				}
			}

			//tmpに順番に格納
			for (h = 0; h < TETRIMINO_HEIGHT; h++) {
				for (w = 0; w < TETRIMINO_WIDTH; w++) {
					if(tetriminos[currentTetriminoKindAI][j][h][w] >= 2 && tetriminos[currentTetriminoKindAI][j][h][w] <= 8){
						tmpEvaluationTetrimino[h][w] = 1;
					}
				}
			}

			//横に置ける数だけ回す
			for (i = startX[currentTetriminoKindAI][j]; i <= endX[currentTetriminoKindAI][j]; i++) {

				currentEvaluationTetriminoPositionY = 0;

				//下まで落下させる
				collisionCheck = collisionCheckTetriminoEvaluation(i,currentEvaluationTetriminoPositionY + 1, tmpEvaluationTetrimino);
				while(collisionCheck == 0){
					currentEvaluationTetriminoPositionY++;
					collisionCheck = collisionCheckTetriminoEvaluation(i,currentEvaluationTetriminoPositionY + 1, tmpEvaluationTetrimino);
				}

				//評価に使うフィールドに格納
				for (h = 0; h < TETRIMINO_HEIGHT; h++) {
					for (w = 0; w < TETRIMINO_WIDTH; w++) {
						if(tmpEvaluationTetrimino[h][w] == 1){
							tmpEvaluationField[currentEvaluationTetriminoPositionY+h][i+w] = tmpEvaluationTetrimino[h][w];
						}
					}
				}

				evaluationScore = evaluationBoardScore();

				if(evaluationScore > maxScore){
					maxScore = evaluationScore;
					maxI = i;
					maxJ = j;
				}

				//評価に使うフィールドに格納したテトリミノを削除
				for (h = 0; h < TETRIMINO_HEIGHT; h++) {
					for (w = 0; w < TETRIMINO_WIDTH; w++) {
						if(tmpEvaluationTetrimino[h][w] == 1){
							tmpEvaluationField[currentEvaluationTetriminoPositionY+h][i+w] = 0;
						}
					}
				}	
			}
		}

		for (rotateJ = 0; rotateJ < maxJ; rotateJ++) {
			if(currentScreenState == screenState.PLAYING){//PLAYINGのときのみ実行しないと強制終了した際に音が鳴る(unsetやdrawFieldは直接影響はないがif文の中に入れている)
                unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
                moveCheck = rotateCurrentTetriminoAI(rotateDirection.RIGHT);
                setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
    
                playSoundKeyboard(soundType.TETRIMINO_ONESHIFT_AND_ROTATE);
    
                await drawFieldAllAsync();
    
                await sleep(moveTetriminoSpeed);
            }

		}

		if(maxI < 4){
			for(sideI = 0; sideI < 4 - maxI; sideI++){
                if(currentScreenState == screenState.PLAYING){
                    unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
                    moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI - 1, currentTetriminoPositionYAI);
                    setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
                
                    playSoundKeyboard(soundType.TETRIMINO_ONESHIFT_AND_ROTATE);

                    await drawFieldAllAsync();
        
                    await sleep(moveTetriminoSpeed);
                }
			}

		}else if(maxI > 4){
			for(sideI = 0; sideI < maxI - 4; sideI++){
                if(currentScreenState == screenState.PLAYING){
                    unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
                    moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI + 1, currentTetriminoPositionYAI);
                    setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
                
                    playSoundKeyboard(soundType.TETRIMINO_ONESHIFT_AND_ROTATE);

                    await drawFieldAllAsync();
        
                    await sleep(moveTetriminoSpeed);
                }
			}
		}

        if(currentScreenState == screenState.PLAYING){
            unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
            moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1);
            while(moveCurrentTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1)) {
                fallDistanceCountAI++;
            }
            playSoundKeyboard(soundType.TETRIMONO_HIGHSPEED_FALL);

            fixTetriminoAI();//fixTetriminoAIでsetTetriminoAIが書かれているのでsetTetriminoAIいらない
        }
	}
}

/*----------------------------------------------------------------------------------------------------*/

//常に呼び出される関数

/*----------------------------------------------------------------------------------------------------*/

function drawElapsedTime(){
	time++;//1秒加算
	hour = Math.floor(time / 3600);//時間(経過秒数÷3600秒)
	min = Math.floor((time % 3600) / 60);//分(時間の余り÷60秒)
	min1 = Math.floor(min / 10);//分の10の位
	min2 = min % 10;//分の1の位
	sec = time % 60;//秒(経過秒数÷60秒の余り)
	sec1 = Math.floor(sec / 10);//秒の10の位
	sec2 = sec % 10;//秒の1の位
	
	clearTimeWindow();
	timeWindow.fillStyle=COLOR_BLACK;
	timeWindow.font="20px serif";
	timeWindow.fillText(hour + ":" + min1 + min2 + ":" + sec1 + sec2,377,55);

	if(aiFlag == 1){
		timeWindow.fillText(hour + ":" + min1 + min2 + ":" + sec1 + sec2,952,55);
	}
}

function mainLoop(){
	let moveCheck;

	if(currentScreenState == screenState.PLAYING && loopLockFlag == 0) {
			
		unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
		moveCheck = moveCurrentTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1);//移動できるなら1つ下に移動させる
		setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);

		//自然落下したら最後の操作をリセットする
		if(moveCheck == 1){
			rotateFlag = 0;
			fallDistanceCount++;
		}

        if(bottomTetriminoPositionY < currentTetriminoPositionY){//位置の最低が更新されている
            softDropFlag = 0;
            softDropCount = 0;
            softDropOver15TimesFlag = 0;
            softDropFloatingFlag = 0;
            clearTimeout(softDropTimer);

            bottomTetriminoPositionY = currentTetriminoPositionY;
        }
	}
}

function mainLoopAI(){
	let moveCheck;
    
	if(currentScreenState == screenState.PLAYING && loopLockFlagAI == 0) {

		unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
		moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1);//移動できるなら1つ下に移動させる
		setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);

		if(moveCheck == 1){
			rotateFlagAI = 0;
			fallDistanceCountAI++;
		}

        if(bottomTetriminoPositionYAI < currentTetriminoPositionYAI){//位置の最低が更新されている
            softDropFlagAI = 0;
            softDropCountAI = 0;
            softDropOver15TimesFlagAI = 0;
            softDropFloatingFlagAI = 0;
            clearTimeout(softDropTimerAI);

            bottomTetriminoPositionYAI = currentTetriminoPositionYAI;
        }
	}
}

async function drawFieldAllAsync(){
    if((currentScreenState == screenState.PLAYING
        || currentScreenState == screenState.COUNTDOWN
        || currentScreenState == screenState.FLOW)){

        drawField();
        if(hiddenCommand_changeTetrimino_Flag == 0){
            drawFieldNext();
        }else if(hiddenCommand_changeTetrimino_Flag == 1){
            drawFieldNextBig();
        }
        drawFieldHold();
        drawScore();
        drawHighScore();
        drawClearLines();
        drawGameLevels();
        drawRens();
        drawTetris();
        drawPerfectClear();
        drawGarbage();
    }
}

function drawFieldAllLoop(){
	if(currentScreenState == screenState.PLAYING && loopLockFlag == 0){
		drawField();
		if(hiddenCommand_changeTetrimino_Flag == 0){
			drawFieldNext();
		}else if(hiddenCommand_changeTetrimino_Flag == 1){
			drawFieldNextBig();
		}
		drawFieldHold();
		drawScore();
		drawHighScore();
		drawClearLines();
		drawGameLevels();
		drawRens();
		drawTetris();
		drawPerfectClear();
		drawDebug();
		drawGarbage();
	}
	else if(currentScreenState == screenState.GAMEOVER) {
		stopAllTimerAnimationFrame();

		stopSoundKeyboard(soundType.TETRIS_MAIN_BGM);//メインBGM停止

        deleteFlowField();//通常終了したときだけ実行
    }
}

function softDropJudgementLoop(){
	let collisionCheck;

	if(currentScreenState == screenState.PLAYING && loopLockFlag == 0){

		unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
		collisionCheck = collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1, currentTetrimino);
		setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
		
		if(softDropFlag == 0){//ソフトドロップの判定が始まっていない
			if(collisionCheck == 1){//下に移動できない
				softDropFlag = 1;//ソフトドロップ判定開始
				softDropTimer = setTimeout(fixTetrimino,500);
			}
		}

        if(softDropFlag == 1 && softDropFloatingFlag == 1){//ソフトドロップの判定中、操作中のテトリミノが宙に浮いている判定なら
            if(collisionCheck == 1){//操作中のテトリミノが浮ている状態から設置状態に遷移したら
                softDropTimer = setTimeout(fixTetrimino,500);
                softDropFloatingFlag = 0;//宙に浮いている判定を設置判定に戻す
            }
        }

		if(softDropOver15TimesFlag == 1){//最低位置を更新していない間に15回以上移動しているなら
			if(collisionCheck == 1){//下に移動できない
				fixTetrimino();
			}
		}
	}
}

function softDropJudgementLoopAI(){
	let collisionCheck;

	if(currentScreenState == screenState.PLAYING && loopLockFlagAI == 0){

		unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
		collisionCheck = collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1, currentTetriminoAI);
		setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
		
		if(softDropFlagAI == 0){//ソフトドロップの判定が始まっていない
			if(collisionCheck == 1){//下に移動できない
				softDropFlagAI = 1;
				softDropTimerAI = setTimeout(fixTetriminoAI,500);
			}
		}

        if(softDropFlagAI == 1 && softDropFloatingFlagAI == 1){//ソフトドロップの判定中、操作中のテトリミノが宙に浮いている判定なら
            if(collisionCheck == 1){//操作中のテトリミノが浮ている状態から設置状態に遷移したら
                softDropTimerAI = setTimeout(fixTetrimino,500);
                softDropFloatingFlagAI = 0;//宙に浮いている判定を設置判定に戻す
            }
        }

		if(softDropOver15TimesFlagAI == 1){//最低位置を更新していない間に15回以上移動しているなら
			if(collisionCheck == 1){//下に移動できない
				fixTetriminoAI();
			}
		}
	}
}

/*----------------------------------------------------------------------------------------------------*/

//キーボード操作に使用する関数

/*----------------------------------------------------------------------------------------------------*/

function keyDownFunc(e){
	let collisionCheck,moveCheck = 0;
	let url, params;

    let selectLevelFlag = 0;//レベル選択の範囲外になったらキーボードのタップ音を鳴らさない

	//ゲーム画面
	if(currentScreenState == screenState.PLAYING  && loopLockFlag == 0){

		unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
		
		if(e.keyCode == 39){//右キー
			moveCheck = moveCurrentTetrimino(currentTetriminoPositionX + 1, currentTetriminoPositionY);
		}
		else if(e.keyCode == 37){//左キー
			moveCheck = moveCurrentTetrimino(currentTetriminoPositionX - 1, currentTetriminoPositionY);
		}
		else if(e.keyCode == 40){//下キー(ソフトドロップ)
			//if文にしないと連続してキーを押したときにmainLoopが回らず操作中のテトリミノが固定位置で止まった描画が永遠に続いてしまう(正確には止まったように見えてしまう)
			//左右や回転の移動はこのリセットはしない仕様
			moveCheck = moveCurrentTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1);
			if(moveCheck == 1){
				fallDistanceCount++;
				//下移動した際に自然落下のタイミングをリセットする
				//つまり、言い換えると、下2行が無い状態では、任意時間秒が経てば直前にキーボード入力で下に移動させても、その直後に自然落下が行われる
				//それを防止するため、キーボード入力により下に移動させた場合、新たに任意時間を置いてから自然落下処理が行われるようにする
				clearInterval(mainLoopTimer);
				mainLoopTimer = setInterval( mainLoop, fallTime );
			};
		}
		else if(e.keyCode == 38){//上キー(ハードドロップ)
			while(moveCurrentTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1)) {
				fallDistanceCount++;
			}
			//clearInterval→mainLoopの順番で書いた場合、高速落下(K)が押された際にレベルアップすると、mainLoopでsetIntervalされた後にsetIntervalされ
			//落下が2マスずつになるバグが発生したため、mainLoop→clerIntervalの順に書き直した

			//その後
			//fixTetriminoに統括
			fixTetrimino();
			
		}
		else if(e.keyCode == 68){//Dキー(右回転)
			moveCheck = rotateCurrentTetrimino(rotateDirection.RIGHT);
		}
		else if(e.keyCode == 65){//Aキー(左回転)
			moveCheck = rotateCurrentTetrimino(rotateDirection.LEFT);
		}
		else if(e.keyCode == 83){//Sキー(ホールド)
			if(holdChangeFlag == 0){

				loopLockFlag = 1;//原因不明のバグが発生するため、短期間ではあるがlockして各ループを実行できないようにする

				playSoundKeyboard(soundType.TETRIMINO_HOLD);
				holdControlTetrimino();
				holdCount++;
				clearInterval(mainLoopTimer);
				mainLoopTimer = setInterval( mainLoop, fallTime );
				holdChangeFlag = 1;

                //ホールドが押されたら(ソフトドロップの判定中にホールドを押すとバグるためリセットする必要がある)
                softDropFlag = 0;
                softDropCount = 0;
                softDropOver15TimesFlag = 0;
                softDropFloatingFlag = 0;
                clearTimeout(softDropTimer);

				loopLockFlag = 0;
			}
		}
		else if(e.keyCode == 81){//Q(強制終了)
			currentScreenState = screenState.QUIT;

            stopAllTimerAnimationFrame();

            stopSoundKeyboard(soundType.TETRIS_MAIN_BGM);//メインBGM停止

            updateRanking();
	        drawGameOverScreen();
            return;
		}
		else if(e.keyCode == 87){//W(一時停止)
			alert("一時停止中です。OKを押すと再開します。");
		}
		else if(e.keyCode == 89){//Y
			if(hiddenCommand_rotateDraw_Flag == 0){
				hiddenCommand_rotateDraw_Counter++;
				if(hiddenCommand_rotateDraw_Counter == 5){
					hiddenCommand_rotateDraw_Flag = 1;
				}
			}else if(hiddenCommand_rotateDraw_Flag == 1){
				hiddenCommand_rotateDraw_Counter--;
				if(hiddenCommand_rotateDraw_Counter == 0){
					hiddenCommand_rotateDraw_Flag = 0;
				}
			}
		}
		else if(e.keyCode == 85){//U
			if(hiddenCommand_halfSecretDraw_Flag == 0){
				hiddenCommand_halfSecretDraw_Counter++;
				if(hiddenCommand_halfSecretDraw_Counter == 5){
					hiddenCommand_halfSecretDraw_Flag = 1;
				}
			}else if(hiddenCommand_halfSecretDraw_Flag == 1){
				hiddenCommand_halfSecretDraw_Counter--;
				if(hiddenCommand_halfSecretDraw_Counter == 0){
					hiddenCommand_halfSecretDraw_Flag = 0;
				}
			}
		}else if(e.keyCode == 73){//I
			hiddenCommand_gameLevelUp_Counter++;
			if(hiddenCommand_gameLevelUp_Counter % 3 == 0){
				gameLevel++;
				fallSpeedUp();
			}
		}else if(e.keyCode == 79){//O
			hiddenCommand_fieldClear_Counter++;
			if(hiddenCommand_fieldClear_Counter % 2 == 0 && hiddenCommand_fieldClear_Counter <= 6){
				fieldClear();
			}
		/*}
        else if(e.keyCode == 32){//Spase(デバッグ用のチート)
			fieldClear();
            garbageCountAI = 3;*/
		}

		//忘備録
		//ハードドロップ(↑=38)の時以外にsetする。↑が押されたときはmainLoopによりsetされるから、ゴーストテトリミノが2回設定されてしまう
		//なぜか、Iミノだけ2重に表示されるバグが発生した。デバッグした結果、他の6種類はwhileで落下位置を落としていくループで1発で1が返され、
		//被さって表示されていたため見た目上はバグは発生したようには見えていない。しかし、謎にIミノだけwhileのところで新たにゴーストテトリミノの落下位置が計算され、2重に表示される。
		//よって、e.keyCode!=38と応急処置し、とりあえずこれでバグは発生しない

		//その後
		//fixTetriminoにより、setされるため、e.keyCode!=38とする
		if(e.keyCode != 38){
			setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
		}

		//holdの音はholdChangeFlagが0のときに鳴らすので上で書いている
		if(moveCheck == 1 &&(e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 40 || e.keyCode == 65 || e.keyCode == 68)){
			playSoundKeyboard(soundType.TETRIMINO_ONESHIFT_AND_ROTATE);
		}else if(e.keyCode == 38){
			playSoundKeyboard(soundType.TETRIMONO_HIGHSPEED_FALL);
		}
		
		drawFieldAllLoop();
		
		//ソフトドロップ判定
        if(bottomTetriminoPositionY < currentTetriminoPositionY){//位置の最低が更新されている
            softDropFlag = 0;
            softDropCount = 0;
            softDropOver15TimesFlag = 0;
            softDropFloatingFlag = 0;
            clearTimeout(softDropTimer);

            bottomTetriminoPositionY = currentTetriminoPositionY;
        }
        
		if(softDropFlag == 1){            
            if(e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 65 || e.keyCode == 68){
				
				unsetTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
				collisionCheck = collisionCheckTetrimino(currentTetriminoPositionX, currentTetriminoPositionY + 1, currentTetrimino);
				setTetrimino(currentTetriminoPositionX, currentTetriminoPositionY, currentTetrimino);
				
				if(softDropCount < 15){
					softDropCount++;
					clearTimeout(softDropTimer);
                    if(collisionCheck == 1){
                        softDropFloatingFlag = 0;
                        softDropTimer = setTimeout(fixTetrimino,500);
                    }else if(collisionCheck == 0){
                        softDropFloatingFlag = 1;
                    }

				}
                if(softDropCount >= 15){//else ifにすると16回目で固定されるようになってしまう
                    softDropOver15TimesFlag = 1;
					if(collisionCheck == 1){
                        fixTetrimino();
                    }else if(collisionCheck == 0){
						clearTimeout(softDropTimer);
					}
				}
			}
		}

		//ホールドが押されたらリセット、これを書かないとゲームが強制的に終了する致命的なバグが発生
		//高速落下時はfixTSoftDropを実行した際にリセットする
		//holdChangeFlag == 0と書かないと連打している間次のテトリミノが生成されない
		if(softDropFlag == 1 && e.keyCode == 83 && holdChangeFlag == 0){
			softDropFlag = 0;
			softDropCount = 0;
			softDropOver15TimesFlag = 0;
			softDropFloatingFlag = 0;
            clearTimeout(softDropTimer);
		}

		//Tスピン判定に用いる
		if(moveCheck == 1 && (e.keyCode == 65 || e.keyCode == 68)){
			rotateFlag = 1;
			rotateCount++;
		}else if(moveCheck == 1 && (e.keyCode != 65 && e.keyCode != 68)){
			rotateFlag = 0;
		}

	//タイトル画面
	}else if(currentScreenState == screenState.TITLE){

        //1か2か3が押されたら音を鳴らす
        if((aiFlag == 0 && (e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51))
        || (aiFlag == 1 && e.keyCode == 49)){

            url = new URL(window.location.href);
            params = url.searchParams;

            if(soundFlag != 1){//初回のみ判定して2回目からリセットして再生されないようにする
                if(params.get('sound') == "false"){
                    soundFlag = 0;
                }else{
                    soundFlag = 1;
                    playSoundKeyboard(soundType.TETRIS_MENU_BGM);
                }
            }
            playSoundKeyboard(soundType.KEYBOARD_TAP);
        }
        
        if(aiFlag == 0){
            if(e.keyCode == 49){    
                drawCountDownScreen();//カウントダウン画面に遷移
            }
            else if(e.keyCode == 50){
                currentScreenState = screenState.RANKING;//状態をランキングに遷移
                drawRankingScreen();//ランキング画面に遷移
            }
            else if(e.keyCode == 51){
                currentScreenState = screenState.HELP;//状態をヘルプに遷移
                drawHelpScreen();//ヘルプ画面に遷移
            }
            else if(e.keyCode == 13){//Enter
                hiddenCommand_changeTetrimino_Counter++;
                if(hiddenCommand_changeTetrimino_Counter == 10){
                    hiddenCommand_changeTetrimino_Flag = 1;
                    alert("特殊なテトリミノに変更！");
                    changeHiddenTetrimino();
                }
            }
            else if(e.keyCode == 32){//Space
                hiddenCommand_mysteriousAddPoints_Counter++;
                if(hiddenCommand_mysteriousAddPoints_Counter == 10){
                    hiddenCommand_mysteriousAddPoints_Flag = 1;
                    alert("謎の倍率が掛かるように変更！");
                }
            }
        }else if(aiFlag == 1){
            if(e.keyCode == 49){
                currentScreenState = screenState.AIMENU;
                drawAIMenuScreen();
                flashingArrowTimer = setInterval(drawAIMenuScreen,750);
            }
        }

	//ランキング画面、またはヘルプ画面
	}else if(currentScreenState == screenState.RANKING || currentScreenState == screenState.HELP){
		if(e.keyCode == 48){
			playSoundKeyboard(soundType.KEYBOARD_TAP);
			currentScreenState = screenState.TITLE;//状態をタイトルに戻す
			drawTitleScreen();
		}
	//ゲームオーバー画面
	}else if(currentScreenState == screenState.GAMEOVER){
		if(e.keyCode == 49){
			playSoundKeyboard(soundType.KEYBOARD_TAP);
			currentScreenState = screenState.TITLE;//状態をタイトルに遷移
			variableReset();
			playSoundKeyboard(soundType.TETRIS_MENU_BGM);
			drawTitleScreen();
            stopSoundKeyboard(soundType.GAME_OVER_BGM);
		}
    //AIの強さ選択画面
	}else if(currentScreenState == screenState.AIMENU){
		if(e.keyCode == 38){
            if(aiLevel < 10){
                aiLevel++;
                drawAIMenuScreen();
            }else{
                selectLevelFlag = 1;
            }
        }else if(e.keyCode == 40){
            if(aiLevel > 1){
                aiLevel--;
                drawAIMenuScreen();
            }else{
                selectLevelFlag = 1;
            }
        }else if(e.keyCode == 48){
			currentScreenState = screenState.TITLE;//状態をタイトルに戻す
			drawTitleScreen();

		}else if(e.keyCode == 49){
            if(aiFlag == 1){//if文は書かなくていいが念のため
                aiLevelSetting();
            }
            drawCountDownScreen();//カウントダウン画面に遷移
        }

        if((e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 48 || e.keyCode == 49) && selectLevelFlag == 0){
            playSoundKeyboard(soundType.KEYBOARD_TAP);
        }

        if(e.keyCode == 48 || e.keyCode == 49){
            clearInterval(flashingArrowTimer);//矢印点滅のタイマーを停止
        }
	}
}

function keyDownFuncAI(e){
	let collisionCheck,moveCheck = 0;
	let url, params;

	//ゲーム画面
	if(currentScreenState == screenState.PLAYING  && loopLockFlagAI == 0){

		unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
		
		if(e.keyCode == 39){//右キー
			moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI + 1, currentTetriminoPositionYAI);
		}
		else if(e.keyCode == 37){//左キー
			moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI - 1, currentTetriminoPositionYAI);
		}
		else if(e.keyCode == 40){//下キー(ソフトドロップ)
			moveCheck = moveCurrentTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1);
			if(moveCheck == 1){
				fallDistanceCountAI++;
				clearInterval(mainLoopTimerAI);
				mainLoopTimerAI = setInterval( mainLoopAI, fallTimeAI );
			};
		}
		else if(e.keyCode == 38){//上キー(ハードドロップ)
			while(moveCurrentTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1)) {
				fallDistanceCountAI++;
			}
			fixTetriminoAI();
			
		}
		else if(e.keyCode == 68){//Dキー(右回転)
			moveCheck = rotateCurrentTetriminoAI(rotateDirection.RIGHT);
		}
		else if(e.keyCode == 65){//Aキー(左回転)
			moveCheck = rotateCurrentTetriminoAI(rotateDirection.LEFT);
		}
		else if(e.keyCode == 83){//Sキー(ホールド)
			if(holdChangeFlagAI == 0){

				loopLockFlagAI = 1;

				playSoundKeyboard(soundType.TETRIMINO_HOLD);
				holdControlTetriminoAI();
				holdCountAI++;
				clearInterval(mainLoopTimerAI);
				mainLoopTimerAI = setInterval( mainLoopAI, fallTimeAI );
				holdChangeFlagAI = 1;

				loopLockFlagAI = 0;
			}
		}//AIのデバッグの際に使うため以下も書いておく
		else if(e.keyCode == 81){//Q(強制終了)
			currentScreenState = screenState.GAMEOVER;
		}
		else if(e.keyCode == 87){//W(一時停止)
			alert("一時停止中です。OKを押すと再開します。");
		}

		if(e.keyCode != 38){
			setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
		}

		//holdの音はholdChangeFlagが0のときに鳴らすので上で書いている
		if(moveCheck == 1 &&(e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 76)){
			playSoundKeyboard(soundType.TETRIMINO_ONESHIFT_AND_ROTATE);
		}else if(e.keyCode == 38){
			playSoundKeyboard(soundType.TETRIMONO_HIGHSPEED_FALL);
		}
		
		drawFieldAllLoop();
		
		//ソフトドロップ判定
        if(bottomTetriminoPositionYAI < currentTetriminoPositionYAI){//位置の最低が更新されている
            softDropFlagAI = 0;
            softDropCountAI = 0;
            softDropOver15TimesFlagAI = 0;
            softDropFloatingFlagAI = 0;
            clearTimeout(softDropTimerAI);

            bottomTetriminoPositionYAI = currentTetriminoPositionYAI;
        }
        
		if(softDropFlagAI == 1){            
            if(e.keyCode == 39 || e.keyCode == 37 || e.keyCode == 65 || e.keyCode == 68){
				
				unsetTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
				collisionCheck = collisionCheckTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI + 1, currentTetriminoAI);
				setTetriminoAI(currentTetriminoPositionXAI, currentTetriminoPositionYAI, currentTetriminoAI);
				
				if(softDropCountAI < 15){
					softDropCountAI++;
					clearTimeout(softDropTimerAI);
                    if(collisionCheck == 1){
                        softDropFloatingFlagAI = 0;
                        softDropTimerAI = setTimeout(fixTetriminoAI,500);
                    }else if(collisionCheck == 0){
                        softDropFloatingFlagAI = 1;
                    }

				}
                if(softDropCountAI >= 15){//else ifにすると16回目で固定されるようになってしまう
                    softDropOver15TimesFlagAI = 1;
					if(collisionCheck == 1){
                        fixTetriminoAI();
                    }else if(collisionCheck == 0){
						clearTimeout(softDropTimerAI);
					}
				}
			}
		}

		if(softDropFlagAI == 1 && e.keyCode == 83 && holdChangeFlagAI == 0){
			softDropFlagAI = 0;
			softDropCountAI = 0;
            softDropOver15TimesFlagAI = 0;
			softDropFloatingFlagAI = 0;
			clearTimeout(softDropTimerAI);
		}

		//Tスピン判定に用いる
		if(moveCheck == 1 && (e.keyCode == 65 || e.keyCode == 68)){
			rotateFlagAI = 1;
			rotateCountAI++;
		}else if(moveCheck == 1 && (e.keyCode != 65 && e.keyCode != 68)){
			rotateFlagAI = 0;
		}

	//タイトル画面
	}else if(currentScreenState == screenState.TITLE){		
		if(e.keyCode == 49 || e.keyCode == 50 || e.keyCode == 51){

			url = new URL(window.location.href);
			params = url.searchParams;

            if(soundFlag != 1){
                if(params.get('sound') == "false"){
                    soundFlag = 0;
                }else{
                    soundFlag = 1;
                    playSoundKeyboard(soundType.TETRIS_MENU_BGM);
                }
            }

			playSoundKeyboard(soundType.KEYBOARD_TAP);//1か2か3が押されたら音を鳴らす
		}
		if(e.keyCode == 49){
			drawCountDownScreen();//カウントダウン画面に遷移
		}
		else if(e.keyCode == 50){
			currentScreenState = screenState.RANKING;//状態をランキングに遷移
			drawRankingScreen();//ランキング画面に遷移
		}
		else if(e.keyCode == 51){
			currentScreenState = screenState.HELP;//状態をヘルプに遷移
			drawHelpScreen();//ヘルプ画面に遷移
		}

	//ランキング画面、またはヘルプ画面
	}else if(currentScreenState == screenState.RANKING || currentScreenState == screenState.HELP){
		if(e.keyCode == 48){
			playSoundKeyboard(soundType.KEYBOARD_TAP);
			currentScreenState = screenState.TITLE;//状態をタイトルに戻す
			drawTitleScreen();
		}

	//ゲームオーバー画面
	}else if(currentScreenState == screenState.GAMEOVER){
		if(e.keyCode == 49){
			playSoundKeyboard(soundType.KEYBOARD_TAP);
			currentScreenState = screenState.TITLE;//状態をタイトルに遷移
			variableReset();
			playSoundKeyboard(soundType.TETRIS_MENU_BGM);
			drawTitleScreen();
		}
	}
}

/*----------------------------------------------------------------------------------------------------*/

//ゲーム音に関する関数

/*----------------------------------------------------------------------------------------------------*/

function playSoundKeyboard(kinds){
	if(soundFlag == 0){
		return;
	}
	if(kinds == soundType.TETRIS_MAIN_BGM){
        if(aiFlag == 0){
            tetrisMainBgm.loop = true;
            tetrisMainBgm.volume = 0.75;
            tetrisMainBgm.currentTime = 0;
            tetrisMainBgm.play();
        }else if(aiFlag == 1){
            tetrisAIBgm.loop = true;
            tetrisAIBgm.volume = 0.75;
            tetrisAIBgm.currentTime = 0;
            tetrisAIBgm.playbackRate = 0.95;
            tetrisAIBgm.play();
        }
		
	}
	else if(kinds == soundType.TETRIS_MENU_BGM){
		tetrisMenuBgm.loop = true;
		tetrisMenuBgm.volume = 1;
		tetrisMenuBgm.currentTime = 0;
		tetrisMenuBgm.play();
	}
	else if(kinds == soundType.TETRIMINO_ONESHIFT_AND_ROTATE){
		tetriminoOneShiftAndRotate.currentTime = 0;
		tetriminoOneShiftAndRotate.play();
	}
	else if(kinds == soundType.TETRIMONO_HIGHSPEED_FALL){
		tetriminoHighSpeedFall.currentTime = 0;
		tetriminoHighSpeedFall.volume = 0.25;
		tetriminoHighSpeedFall.play();
	}
	else if(kinds == soundType.TETRIMINO_HOLD){
		tetriminoHold.currentTime = 0;
		tetriminoHold.play();
	}
	else if(kinds == soundType.ERASE_LINE_1TO3){//ライン消去
		eraseLine1to3.currentTime = 0.15;
		eraseLine1to3.volume = 0.25;
		eraseLine1to3.play();
	}
	else if(kinds == soundType.ERASE_LINE_4){//4ライン消去
		eraseLine4.currentTime = 0.0;
		eraseLine4.play();
	}
	else if(kinds == soundType.COUNT_DOWN){
		countDown.currentTime = 0;
		countDown.play();
	}
	else if(kinds == soundType.TETRIMINO_FLOW){
		tetriminoFlow.currentTime = 0;
		tetriminoFlow.play();
	}
	else if(kinds == soundType.GAME_OVER_BGM){
		gameOverBgm.currentTime = 0;
		gameOverBgm.play();
	}
	else if(kinds == soundType.KEYBOARD_TAP){//キーボード入力音
		keyboardTap.currentTime = 0.15;
		keyboardTap.play();
	}	
}

function stopSoundKeyboard(kinds){
	if(soundFlag == 0){
		return;
	}
	if(kinds == soundType.TETRIS_MAIN_BGM){
        if(aiFlag == 0){
            tetrisMainBgm.pause();//メインBGMを止める
        }else if(aiFlag == 1){
            tetrisAIBgm.pause();//メインBGMを止める
        }
		
	}
	else if(kinds == soundType.TETRIS_MENU_BGM){
		tetrisMenuBgm.pause();//オルゴールを止める
	}
    else if(kinds == soundType.GAME_OVER_BGM){
		gameOverBgm.pause();
	}
}

/*----------------------------------------------------------------------------------------------------*/

//起動

/*----------------------------------------------------------------------------------------------------*/

function disableScroll(e) {
	e.preventDefault();
}

window.addEventListener("DOMContentLoaded", function(){
	
	init();//初期化

	document.addEventListener("keydown", keyDownFunc, false);//キーボードイベント設定
    document.addEventListener('wheel', disableScroll, { passive: false });//PCのスクロール禁止
	document.addEventListener('touchmove', disableScroll, { passive: false });//スマホのスクロール禁止
 	
	drawTitleScreen();

});

/*--------------------------------------------------------------------------------*/

//盗用厳禁

/*--------------------------------------------------------------------------------*/