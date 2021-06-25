"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../utils/util");
Page({
    data: {
        logs: [],
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(function (log) {
                return {
                    date: util_1.formatTime(new Date(log)),
                    timeStamp: log
                };
            }),
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5Q0FBNkM7QUFFN0MsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLEVBQUU7S0FDVDtJQUNELE1BQU07UUFDSixJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFXO2dCQUN0RCxPQUFPO29CQUNMLElBQUksRUFBRSxpQkFBVSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMvQixTQUFTLEVBQUUsR0FBRztpQkFDZixDQUFBO1lBQ0gsQ0FBQyxDQUFDO1NBQ0gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGxvZ3MudHNcbi8vIGNvbnN0IHV0aWwgPSByZXF1aXJlKCcuLi8uLi91dGlscy91dGlsLmpzJylcbmltcG9ydCB7IGZvcm1hdFRpbWUgfSBmcm9tICcuLi8uLi91dGlscy91dGlsJ1xuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIGxvZ3M6IFtdLFxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGxvZ3M6ICh3eC5nZXRTdG9yYWdlU3luYygnbG9ncycpIHx8IFtdKS5tYXAoKGxvZzogc3RyaW5nKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGF0ZTogZm9ybWF0VGltZShuZXcgRGF0ZShsb2cpKSxcbiAgICAgICAgICB0aW1lU3RhbXA6IGxvZ1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICB9KVxuICB9LFxufSlcbiJdfQ==