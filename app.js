// app.js / 김성수(2651010)

// ===== Part A =====
let sumA = 0;
let maxA = 0;
let count8A = 0;
let count2020A = 0;
let count2010A = 0;
let count2000A = 0;
let countOldA = 0;
let bigA = "";

for (let i = 0; i < titles.length; i++) {
  sumA += ratings[i];

  if (ratings[i] > ratings[maxA]) {
    maxA = i;
  }

  if (ratings[i] >= 8) {
    count8A++;
  }

  const decade = years[i] - (years[i] % 10);
  switch (decade) {
    case 2020:
      count2020A++;
      break;
    case 2010:
      count2010A++;
      break;
    case 2000:
      count2000A++;
      break;
    default:
      countOldA++;
      break;
  }

  if (audiences[i] >= 1000000) {
    bigA += (bigA === "" ? "" : " ") + titles[i];
  }
}

if (bigA === "") {
  bigA = "없음";
}

console.log(`A1 평균 평점: ${sumA / titles.length}`);
console.log(`A2 최고 평점: ${titles[maxA]} ${ratings[maxA]}`);
console.log(`A3 8점 이상: ${count8A}편`);
console.log(`A4 2020년대 ${count2020A}편, 2010년대 ${count2010A}편, 2000년대 ${count2000A}편, 그 이전 ${countOldA}편`);
console.log(`A5 관객 100만 이상: ${bigA}`);


// ===== Part B =====

// average : 배열 => 평균 평점(숫자)
function average(list) {
  return averageBy(list, "rating");
}

// best : 배열 => 최고 평점 객체
function best(list) {
  let topMovie = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i].rating > topMovie.rating) {
      topMovie = list[i];
    }
  }
  return topMovie;
}

// filterByRating : 배열, 숫자 => 새 배열
function filterByRating(list, min) {
  return list.filter(function (movie) {
    return movie.rating >= min;
  });
}

// sortBy : 배열, 키 이름, 참이면 내림차순 => 새 배열
function sortBy(list, key, desc) {
  const sign = desc ? -1 : 1;
  return [...list].sort(function (a, b) {
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]) * sign;
    }
    return (a[key] - b[key]) * sign;
  });
}

// search : 배열, 문자열 => 새 배열
function search(list, keyword) {
  const query = keyword.trim().toLowerCase();
  return list.filter(function (movie) {
    return movie.title.toLowerCase().includes(query);
  });
}

// formatNumber : 숫자나 숫자 문자열 => "1,234,567"
function formatNumber(n) {
  return Number(n).toLocaleString("ko-KR");
}

// yearsSince : "2014-11-06" => 올해까지 몇 년(숫자)
function yearsSince(dateStr) {
  const releaseYear = new Date(dateStr).getFullYear();
  const thisYear = new Date().getFullYear();
  return thisYear - releaseYear;
}

const bestMovie = best(movies);
const topAudienceMovie = sortBy(movies, "audience", true)[0];

document.getElementById("out").textContent =
  `전체 ${movies.length}편, 평균 평점 ${average(movies).toFixed(1)}점\n` +
  `최고 평점 ${bestMovie.title} (${bestMovie.rating}점, 개봉한 지 ${yearsSince(bestMovie.date)}년)\n` +
  `관객 1위 ${topAudienceMovie.title} (누적 ${formatNumber(topAudienceMovie.audience)}명)`;


// ===== Part C =====

// getList : 응답 객체 => 영화 배열
function getList(data) {
  return data.results;
}

// averageBy : 배열, 키 이름 => 그 키 값의 평균(숫자)
function averageBy(list, key) {
  const total = list.reduce(function (acc, item) {
    return acc + item[key];
  }, 0);
  return total / list.length;
}

if (typeof TMDB !== "undefined" && TMDB.results) {
  console.log(`C1: page=${TMDB.page}, total_pages=${TMDB.total_pages}, total_results=${TMDB.total_results}, 현재 응답 수=${getList(TMDB).length}`);
  console.log(`C2: 상영작 평균 평점 ${averageBy(getList(TMDB), "vote_average").toFixed(1)}`);
  console.table(sortBy(getList(TMDB), "vote_average", true).slice(0, 5), ["title", "release_date", "vote_average"]);
  // 실제 TMDB 응답 영화 제목에 있는 글자로 바꿔서 실행하세요.
  console.log(`C4: 검색 결과 ${search(getList(TMDB), "스파이더맨").length}편`);
}


// ===== Step 5. 보너스 =====

// formatDate : "2014-11-06" => "2014년 11월 6일 (목)"
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekNames[d.getDay()]})`;
}

// loadJson : tmdb.json 파일 => 콘솔에 평점 상위 5편 표 (보너스 진행 시 주석 해제)
/*
async function loadJson() {
  const res = await fetch("tmdb.json");
  const data = await res.json();
  console.table(sortBy(getList(data), "vote_average", true).slice(0, 5), ["title", "vote_average"]);
}
loadJson();
*/