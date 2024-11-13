<script setup lang='ts'>
import { ref } from 'vue'
import { updateIndexInfo, getIndexInfo } from '@/api/ticket'
import RichEditor from '@/components/RichEditor/index.vue'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'infoList'
})
const infoList = ref([
  {
    id: 'huodongxinxi',
    type: 1,
    title: '活动信息',
    content: 'xxx',
    icon: 'huodongxinxi'
  },
  {
    id: 'youkexuzhi',
    type: 2,
    title: '游客须知',
    content: 'xxx',
    icon: 'youkexuzhi'
  },
  {
    id: 'jingqujieshao',
    type: 3,
    title: '景区介绍',
    content: 'xxx',
    icon: 'jingqujieshao'
  },
])

const dialogVisible = ref(false)
const currentInfo = ref<any>(null)
const editorContent = ref('')

const getImageUrl = (icon: string) => {
  return new URL(`../../assets/index/${icon}.png`, import.meta.url).href
}

// 打开编辑对话框
const handleEdit = async (item: any) => {
  try {
    const res = await getIndexInfo(item.id)

    // 假设接口返回的数据结构中包含 content 字段
    if (res.data) {
      currentInfo.value = item
      editorContent.value = res.data.textConfigurationIntro || ''
      dialogVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 保存更新
const handleSave = async () => {
  try {
    await updateIndexInfo({
      "textConfigurationId": currentInfo.value.id,
      "textConfigurationType": currentInfo.value.type, //1 活动信息   2 游客须知  3 景区介绍
      "textConfigurationIntro": editorContent.value //介绍
    })

    // 更新本地数据
    const index = infoList.value.findIndex(item => item.id === currentInfo.value.id)
    if (index !== -1) {
      infoList.value[index].content = editorContent.value
    }

    ElMessage.success('更新成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新失败')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between ">
      <el-card shadow="hover" class="info-card" style=" margin-top: 20px;padding: 20px; border-radius:10px;width: 30%;"
        v-for="item in infoList" :key="item.id">
        <!-- 第一行：图标和状态 -->
        <div class="flex justify-between">
          <div class="flex">
            <div class="w-20 h-20">
              <el-image :src="getImageUrl(item.icon)" fit="cover"></el-image>
            </div>
            <div class="mt-2 ml-3">
              <div class="text-[22px] font-bold mb-1 ml-2">{{ item.title }}</div>
            </div>
          </div>
          <div class="mt-2">
            <el-button type="primary" size="default" round @click="handleEdit(item)">编辑</el-button>
            <el-icon>
              <More />
            </el-icon>
          </div>
        </div>
        <!-- 第二行：标题和内容 -->
        <!-- <div>
          <div class="text-[22px] font-bold mb-1 ml-2">{{ item.title }}</div>
          <div class="text-sm text-gray-500">{{ item.content }}</div>
        </div> -->
      </el-card>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="`编辑${currentInfo?.title || ''}`" width="60%"
      :before-close="() => dialogVisible = false">
      <RichEditor v-model="editorContent" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped></style>
