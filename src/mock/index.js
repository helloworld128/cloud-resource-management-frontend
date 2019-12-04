import Mock from 'mockjs';

Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
        this.custom.xhr.withCredentials = this.withCredentials || false;
    }
    this.proxy_send(...arguments);
};

Mock.mock(/\/test\/filetree/, 'get', {
    filetree : [
        {
            label: 'test1',
            children : [
                {
                    label: 'sub1'
                },
                {
                    label: 'sub2'
                },
            ],
        },
        {
            label: 'test2',
        }
    ]
});

export default Mock;