<template>
    <flexbox :gutter="0" wrap="wrap" orient="vertical" class="divbg">
        <flexbox-item>
            <divider style="padding:15px 0;font-size:14px;color:#00AF3F">服务建议</divider>
        </flexbox-item>
        <flexbox-item style="padding:3px 0;">
            <x-table style="background-color:#fff;">
                <thead>
                    <tr style="background-color: #F7F7F7">
                        <th>服务面积</th>
                        <th>参考时长</th>
                        <th>建议人数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>80～120平米</td>
                        <td>3-4小时</td>
                        <td> x 1</td>
                    </tr>
                    <tr>
                        <td>120～180平米</td>
                        <td>4-5小时</td>
                        <td> x 2</td>
                    </tr>
                    <tr>
                        <td>180～300平米</td>
                        <td>4-5小时</td>
                        <td> x 3</td>
                    </tr>
                </tbody>
            </x-table>
            <br />
        </flexbox-item>
    </flexbox>
</template>

<script>
    import {
        Flexbox,
        FlexboxItem,
        Divider,
        XTable
    } from 'vux'
    export default {
        components: {
            Flexbox,
            FlexboxItem,
            Divider,
            XTable
        }
    }
</script>

<style lang="less">
    @import "../../assets/less/theme";
</style>
