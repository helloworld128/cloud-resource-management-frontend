<template>
    <div class="console" id="terminal"></div>
</template>
<script>
import Terminal from './Xterm'
export default {
  name: 'terminal',
  props: {
    terminal: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      wsid: this.baseWS + sessionStorage.getItem("problem_wsid"),
      term: null,
      terminalSocket: null
    }
  },
  mounted () {
    let terminalContainer = document.getElementById('terminal')
    this.term = new Terminal({
                  cols: 100,
                  rows: 10,
                  cursorBlink: 5,
                  scrollback: 30,
                  tabStopWidth: 4
              });
    this.term.open(terminalContainer)
    this.term.fit();
    // open websocket
    this.terminalSocket = new WebSocket(this.wsid)
    this.term.attach(this.terminalSocket)
    this.term._initialized = true
  },
  beforeDestroy () {
    this.terminalSocket.close()
    this.term.destroy()
  }
}
</script>