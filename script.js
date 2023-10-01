document.addEventListener("DOMContentLoaded", function () {
  const imageSources = [
    "img/taiki.png",
    "img/hello.png",
    "img/tere.png",
    "img/oko.png",
    "img/what.png",
    "img/mute.png",
    "img/mic.png"
  ];

  function preloadImages(sources) {
    const promises = sources.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    return Promise.all(promises);
  }
  preloadImages(imageSources).then(() => {
    const resultDiv = document.querySelector("#result");
    const robotDiv = document.querySelector("#robot");
    const micDiv = document.querySelector("#mic");
    const realtimeDiv = document.querySelector("#realtime-result");
    const btnElement = document.getElementById("btn");
    const finalResultDiv = document.querySelector("#final-result");

    let rec = new webkitSpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "ja-JP";

    let stopped = true;

    micDiv.onclick = function () {
      resultDiv.querySelectorAll("p").forEach((p) => {
        p.innerHTML = "";
        robotDiv.setAttribute("src", "img/taiki.png");
      });
      if (stopped) {
        realtimeDiv.innerHTML = "";
        stopped = false;
        rec.start();
        console.log("start");
      } else {
        rec.stop();
        rec.stop();
        realtimeDiv.innerHTML = "";
        finalResultDiv.innerHTML = "";
        resultDiv.querySelectorAll("p").forEach((p) => {
          p.innerHTML = "";
        });
        document.body.classList.remove("recording");
        btnElement.classList.remove("recording");
        micDiv.setAttribute("src", "img/mute.png");
        stopped = true;
        console.log("stopped by user");
      }
    };

    rec.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
    };

    rec.onaudiostart = function () {
      document.body.classList.add("recording");
      btnElement.classList.add("recording");
      micDiv.setAttribute("src", "img/mic.png");
    };

    rec.onend = function () {
      document.body.classList.remove("recording");
      btnElement.classList.remove("recording");
      micDiv.setAttribute("src", "img/mute.png");
      console.log("end");
      stopped = true;
    };

    rec.onresult = function (e) {
      let interimTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        let text = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          realtimeDiv.innerHTML = "";
          finalResultDiv.innerHTML = "";
          console.log(text);
          if (/ぽんこつロボットくん|ポンコツろぼっとくん|ポンコツろぼっと君|ぽんこつロボット君/.test(text)) {
            finalResultDiv.setAttribute(
              "data-text",
              "＞" +
                text +
                "<br>あれあれ　不機嫌になっちゃった<br>「ぽんこつ」が気に入らないみたい<br>そういう名前なんだからしょうがないね"
            );
            robotDiv.setAttribute("src", "img/oko.png");
          } else if (
            /こんにちは|こんばんは|おはよう|よろしく|やっほー|ハロー|はろー|さようなら|さよなら|またね|おやすみ|おつかれさま|いってきます|ただいま|ひさしぶり|おかえり/.test(
              text
            )
          ) {
            finalResultDiv.setAttribute(
              "data-text",
              "＞" +
                text +
                "<br>ぽんこつロボットくん<br>両手をあげて一生懸命お返事しています<br>挨拶してくれてありがとう！"
            );
            robotDiv.setAttribute("src", "img/hello.png");
          } else if (/えらい|かっこいい|凄い|可愛い|偉い|優秀/.test(text)) {
            finalResultDiv.setAttribute(
              "data-text",
              "＞" +
                text +
                "<br>ぽんこつロボットくん<br>どうやら照れちゃったみたい<br>褒められると恥ずかしくなっちゃうんだね"
            );
            robotDiv.setAttribute("src", "img/tere.png");
          } else {
            robotDiv.setAttribute("src", "img/what.png");
            finalResultDiv.setAttribute(
              "data-text",
              "＞" +
                text +
                "<br>ぽんこつロボットくん<br>言われた意味がよくわからないみたい<br>他の言葉をかけてみてね"
            );
          }

          setTimeout(() => {
            finalResultDiv.innerHTML = finalResultDiv.getAttribute("data-text");
          }, 200); // 1000ミリ秒 = 1秒
          rec.stop();
        } else {
          interimTranscript += text;
          realtimeDiv.innerHTML = interimTranscript;
        }
      }
    };
  });
});
