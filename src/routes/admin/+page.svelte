<script lang="ts">
  import {onMount} from "svelte";
  import {getRandomId} from "../../utils/random";

let message = ''
let name = ''
let isEnterSend = false

let password = ''
let isEnalbe: boolean | undefined = undefined

const sendMessage = () => {
  if(message.trim() === '') return
  fetch('/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, message })
  })
  message = ''
}

onMount(() => {
  isEnalbe = sessionStorage.getItem('isEnable') === 'true'

  name = localStorage.getItem('adminName') || `관리자_${getRandomId(10)}`
  isEnterSend = localStorage.getItem('isEnterSend') === 'true'
})

const onAdminNameChange = () => {
  localStorage.setItem('adminName', name)
}

const onKeyUp = (e: any) => {
  if(isEnterSend && e.key === 'Enter') {
    sendMessage()
  }
}

const onChangeEnterSend = (e: any) => {
  isEnterSend = e.target.checked
  localStorage.setItem('isEnterSend', isEnterSend.toString())
}

const onLoginEnter = (e: any) => {
  if(e && e.key === 'Enter') {
    onLogin()
  }
}

const onLogin = () => {
  if(password === 'shuma') {
    isEnalbe = true
    sessionStorage.setItem('isEnable', 'true')
    return;
  }

  password = ''
  alert('비밀번호가 틀렸습니다.')
}

</script>

<div>
  {#if isEnalbe === undefined}
    <div>...</div>
  {/if}
  {#if isEnalbe === false}
    <div style={'width: 100%; text-align: center; padding: 20px 0; background-color: #f8d7da; color: #721c24;'}> 
      로그인이 필요합니다.
    </div>
    <div style="width: 500px; margin: 0 auto;">
      <input style="padding: 10px 20px; width: 455px; margin-bottom: 10px;" type="password" on:keyup={onLoginEnter} bind:value={password} placeholder={'비밀번호를 입력해주세요.'} />
      <button style="padding: 10px; width: 100%; background: #007bff; border: none; outline: none; color: white;" on:click={onLogin}>로그인</button>
    </div>
  {/if}
  {#if isEnalbe}
<div class="container">
  <h1> 관리자 페이지 </h1>
  <details style={'width: 100%; margin: 20px 0;'}>
    <summary> 간단한 설명 </summary>
    <p>
      관리자 페이지입니다. 관리자는 사용자들에게 채팅을 발송합니다. 받은 메세지를 받으며, 채팅이 TTS로 들립니다. 
      <br/>
      관리자 이름은 자동으로 만들어지나, 확실한 구분을 위해서 변경하시는걸 추천드립니다. 한번 작성해두면 자동으로 저장되어 다음에도 동일하게 사용하실 수 있습니다.
    </p>
  </details>

  <div style="width: 100%;">
    <label for="name"> 관리자 이름 <input type="text" on:change={onAdminNameChange} bind:value={name} /> </label>
    <label for="name">
      메세지 
      <input type="text" bind:value={message}  on:keyup={onKeyUp} placeholder={'메세지를 입력해주세요.'} style={'padding: 5px 0;'} /> 
      <div class={'button-area'}>
        <label for="name">
          <input type="checkbox" on:change={onChangeEnterSend} bind:checked={isEnterSend} placeholder={'메세지를 입력해주세요.'} style={'padding: 5px 0;'} />
          엔터로 보내기
        </label>
        <button on:click={sendMessage}>Send</button>
      </div>
    </label>
  </div>
</div>
  {/if}
</div>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
}
input {
  width: 100%;
}
label {
  display: block;
  margin: 10px 0;
}

.button-area {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.button-area button {
  margin: 5px 0;
  padding: 5px 10px;
  height: 40px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  outline: none;
}
.button-area button:hover {
  background-color: #0056b3;
}
.button-area label {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button-area input {
  margin: 0;
  width: 20px;
}
</style>