const icons = ['hidrogen', 'litium', 'natrium', 'kalium', 'rubidium', 'sesium', 'fransium', 'barium', 'berilium', 'kalsium', 'magnesium', 'radium', 'stronsium', 'aktinium', 'itrium', 'lantanum', 'skandium', 'titanium', 'zirkonium', 'hafnium', 'vanadium', 'tantalum'];
const board = document.querySelector('.game-board');
const reset = document.getElementById('reset');
const replay = document.getElementById('replay');
const form = document.getElementById('form');
const difficulties = document.querySelectorAll("input[name='difficulty']");
const timer = document.getElementById('timer');
const ratingPerfect = document.getElementById('rating-perfect');
const ratingAverage = document.getElementById('rating-average');
const cardContainers = document.querySelectorAll('.card-container');
const modal = document.querySelector('.modal');
let clickCount = 0;
let selectedCards = [];
let iconClasses, sec, moves, wrongMoves, correctMoves, difficulty, difficultyClass, setTimer;

// Fungsi untuk mengacak array
function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
}

// Cek pilihan tingkat kesulitan pada radio button
function checkDifficulty(){
	[].forEach.call(difficulties, function(input){
		input.nextElementSibling.classList.remove('checked');
		console.log(input.nextElementSibling)
		if (input.value === 'easy' && input.checked === true) {
			difficulty = 4;
			difficultyClass = 'easy';
			input.nextElementSibling.classList.add('checked');
		} else if (input.value === 'normal' && input.checked === true) {
			difficulty = 16;
			difficultyClass = 'normal';
			input.nextElementSibling.classList.add('checked');
		} else if (input.value === 'hard' && input.checked === true) {
			difficulty = 36;
			difficultyClass = 'hard';
			input.nextElementSibling.classList.add('checked');
		}
	});
}

// Mengisi papan permainan dengan kartu
function populate(num) {
	iconClasses = [];
	clickCount = 0;
	board.innerHTML = '';
	// Mengacak array utama dan memotong setengah jumlah kartu
	// Mendapatkan pilihan gambar yang acak
	shuffle(icons);
	let boardIcons = icons.slice(0, num/2);
	// Duplikasi nilai-nilai array untuk membuat pasangan dan mengacak array baru ini
	boardIcons = boardIcons.concat(boardIcons);
	shuffle(boardIcons);
	// Mengisi HTML sebenarnya
	const fragment = document.createDocumentFragment();
	for (let x = 0; x < num; x++) {
		const cardContainer = document.createElement('div');
		cardContainer.classList.add('card-container', difficultyClass);
		const front = document.createElement('div');
		const back = document.createElement('div');
		front.classList.add('card', 'front');
		back.classList.add('card', 'back');
		const icon = document.createElement('img');
		icon.classList.add('icon');
		icon.src = 'img/unsur/' + boardIcons[x] + '.png';
		back.appendChild(icon);
		cardContainer.appendChild(front);
		cardContainer.appendChild(back);
		fragment.appendChild(cardContainer);
	}
	board.appendChild(fragment);
}

function stopwatch(){
	sec+=1;
	if (sec<60) {
		timer.innerText = sec;
	} else if (sec<3600) {
		let minutes = Math.floor(sec/60);
		let seconds = sec % 60;
		timer.innerText = minutes+":"+seconds;
	}
}

function rating(num) {
	// Penilaian bintang/rating berbeda dengan tingkat kesulitan
	switch (difficultyClass) {
		case 'easy' :
			if (num === 2) {
				ratingPerfect.classList.add('hide');
			} else if (num === 3) {
				ratingAverage.classList.add('hide');
			};
			break;
		case 'normal' :
			if (num === 8) {
				ratingPerfect.classList.add('hide');
			} else if (num === 12) {
				ratingAverage.classList.add('hide');
			};
			break;
		case 'hard' :
			if (num === 18) {
				ratingPerfect.classList.add('hide');
			} else if (num === 27) {
				ratingAverage.classList.add('hide');
			};
			break;
	}
}

// Memeriksa apakah permainan sudah dimenangkan
function checkWin(num) {
	// Level 1 menang dengan 2 pasangan kartu benar, level 2 dengan 8, dan level 3 dengan 18
	let won;
	switch (difficultyClass) {
		case 'easy' :
			if (num === 2) {
				won = true;
			};
			break;
		case 'normal' :
			if (num === 8) {
				won = true;	
			};
			break;
		case 'hard' :
			if (num === 18){
				won = true;
			};
			break;
	};
	if (won === true) {
		// Tunggu 1 detik agar kartu bisa terlihat
		setTimeout(function(){
			// Isi dan tampilkan modal
			document.getElementById('final-time').innerText = timer.innerText;
			document.getElementById('final-moves').innerText = moves;
			document.getElementById('final-rating').innerHTML = document.getElementById('stars').innerHTML;
			modal.classList.remove('hide');
			// Hentikan stopwatch
			clearInterval(setTimer);
		}, 1000);
	}
}

// Memeriksa apakah kartu cocok
function matchChecker(e){
	// Pastikan target klik adalah kartu dan hindari double-clicking
	if (e.target.classList.contains('card') && !e.target.classList.contains('front-open')) {
		// Putar kartu saat diklik
		e.target.classList.add('front-open');
		e.target.nextElementSibling.classList.add('back-open');
		// Catat sumber gambar di kartu yang diklik
		iconClasses.push(e.target.nextElementSibling.firstChild.src);
		// Kumpulkan elemen kartu yang diklik
		selectedCards.push(e.target);
		clickCount += 1;
		// Hanya izinkan dua klik lalu periksa kecocokan gambar
		if (clickCount === 2) {
			clickCount = 0;
			// 2 klik menghasilkan 1 gerakan
			moves +=1;
			document.getElementById('moves').innerHTML = moves;
			// Mencegah klik kartu tambahan selama 1 detik saat 2 kartu yang sudah diklik sedang diperiksa
			board.removeEventListener('click', matchChecker);
			setTimeout(function(){
				board.addEventListener('click', matchChecker);
			}, 1000);
			if (iconClasses[0]===iconClasses[1]) {
				console.log('match');
				correctMoves += 1;
				// Periksa apakah permainan sudah dimenangkan
				checkWin(correctMoves);
				iconClasses = [];
				// Tambahkan kelas 'correct' untuk menjaga kartu yang cocok tetap terbuka
				[].forEach.call(selectedCards, c =>{
					c.classList.add('front-correct');
					c.nextElementSibling.classList.add('back-correct');	
				});
			} else {
				console.log('not match');
				// Hapus bintang jika terlalu banyak gerakan yang salah, seberapa banyak tergantung pada tingkat kesulitan
				wrongMoves +=1;
				rating(wrongMoves);
				// Tunggu 1 detik sebelum menutup kartu yang tidak cocok, agar pemain bisa melihat kartu apa yang mereka pilih
				setTimeout(function(){
					iconClasses = [];
					[].forEach.call(selectedCards, c =>{
						c.classList.remove('front-open');
						c.nextElementSibling.classList.remove('back-open');
						selectedCards = [];
					});
				}, 1000);
			}
		}
	}
}

function startGame() {
	// Bersihkan papan permainan dan atur ulang semuanya
	sec = 0; 
	moves = 0;
	wrongMoves = 0;
	correctMoves = 0;
	timer.innerText = '0';
	document.getElementById('moves').innerHTML = '0';
	modal.classList.add('hide');
	ratingPerfect.classList.remove('hide');
	ratingAverage.classList.remove('hide');
	clearInterval(setTimer);
	// Memulai logika permainan kembali
	checkDifficulty();
	populate(difficulty);
	// Memulai timer saat klik pertama
	board.addEventListener('click', function clickOnce(){
		clearInterval(setTimer);
		setTimer = setInterval(stopwatch, 1000);
		board.removeEventListener('click', clickOnce)
	});
}

reset.addEventListener('click', startGame);
replay.addEventListener('click', startGame);
form.addEventListener('change', startGame);
window.addEventListener('click', function(e){
	if (e.target === modal) {
		startGame();
	}
});
board.addEventListener('click', matchChecker);
window.addEventListener('load', startGame);