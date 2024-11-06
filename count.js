const checkbox = document.getElementById('switch');
const countdownDiv = document.getElementById('countdown');
// チェックボックスの変更イベントリスナー
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    countdownDiv.style.display = 'none'; // チェックが入っている場合、カウントダウンを非表示にする
  } else {
    countdownDiv.style.display = 'flex'; // チェックが入っていない場合、カウントダウンを表示する
  }
});
// 初期状態はOFFなので、最初はカウントダウンを表示しておく
countdownDiv.style.display = 'flex';
const rgbOnCountdownDiv = document.getElementById('rgb-on');
// チェックボックスの変更イベントリスナー
checkbox.addEventListener('change', () => {
  const isSwitchOn = checkbox.checked;
  // RGBがONの場合はカウントダウンを非表示にし、OFFの場合は表示する
  countdownDiv.style.display = isSwitchOn ? 'none' : 'flex';
  rgbOnCountdownDiv.style.display = isSwitchOn ? 'flex' : 'none';
});
// 初期状態はOFFなので、最初はカウントダウンを表示しておく
countdownDiv.style.display = 'flex';
rgbOnCountdownDiv.style.display = 'none';
const switchTitle = document.querySelector('.title');
// チェックボックスの変更イベントリスナー
checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    // スイッチがONの場合
    switchTitle.textContent = 'ON';
  } else {
    // スイッチがOFFの場合
    switchTitle.textContent = 'OFF';
  }
});
// 初期状態はOFFなので、最初は'OFF'を表示しておく
switchTitle.textContent = 'OFF';
const closeButton = document.querySelector('.close-button');
const rgbButton = document.querySelector('.rgb-button');
// close-buttonのクリックイベントリスナー
closeButton.addEventListener('click', () => {
  // rgb-buttonを非表示にする
  rgbButton.style.display = 'none';
});
// 初期状態はrgb-buttonを表示しておく
rgbButton.style.display = 'block';
