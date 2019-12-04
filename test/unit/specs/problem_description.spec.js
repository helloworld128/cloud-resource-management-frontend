import Vue from 'vue'
import problem_description from '@/components/problem_description/problem_description.vue'

describe('problem_description.vue', () =>{
    it('sets the correct default data', () => {
        expect(typeof problem_description.data).toBe('function')
        const Data = problem_description.data()
        expect(Data.hasproblem).toBe(true)
        expect(Data.terminal).toBe({
            pid: 1,
            name: 'terminal',
            cols: 400,
            rows: 400
        })
    })
    it()
})