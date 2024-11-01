<script setup lang='ts'>
import { getTicketList, getDict } from '@/api/ticket';
import { ref, onMounted } from 'vue';
defineOptions({
  name: 'ticketList'
})

const tableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const bolMap = {
  Y: true,
  N: false
}


const getTicket = async () => {
  console.log(currentPage.value, pageSize.value);

  const req = {
    "ticketListName": "", //票类名称
    "pageNum": currentPage.value,
    "pageSize": pageSize.value,
    "sortField": "a.create_time",
    "sortOrder": "desc"
  }

  console.log(req);

  const { code, data } = await getTicketList(req)

  if (+code) {
    tableData.value = data.list
    total.value = data.totalSize

  } else {
  }
}

const dialogVisible = ref(false)
import { ElMessageBox } from 'element-plus'

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要退出编辑吗?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
const form = ref({
  name: ''
})

const value = ref('')


import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const value1 = ref('')
const options = ref([])
const getTicketDict = async () => {
  const { code, data } = await getDict('ticket_list_type')
  if (+code) {
    options.value = data
  } else {
    ElMessageBox.alert('获取票类字典失败')
  }

}

onMounted(() => {
  getTicket()
})

import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <div>
    <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:10px; height: 100%;">

      <div>
        <el-button type="primary" @click="dialogVisible = true">
          <IconifyIconOnline icon="ep:plus" />新增票类
        </el-button>
      </div>

      <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
        <el-table-column fixed prop="ticket_list_name" label="名称" align="center" />
        <el-table-column prop="ticket_list_type" label="票类" align="center">
          <template #default="{ row }">
            <el-tag :type="row.ticket_list_type === '成人票' ? 'primary' : 'success'"> {{ row.ticket_list_type
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ticket_list_price" label="价格" align="center" />
        <el-table-column prop="saleable_range_end_date" label="有效日期" align="center" />
        <el-table-column prop="is_enable" label="状态" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.is_enable" active-value="Y" inactive-value="N"></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120" align="center">
          <template #default>
            <el-button link type="primary" @click="dialogVisible = true">
              编辑
            </el-button>
            <el-button link type="primary">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-5 flex flex-row-reverse">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
          :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="getTicket"
          @current-change="getTicket" />
      </div>

    </el-card>



    <el-dialog v-model="dialogVisible" width="1200" :before-close="handleClose">

      <template #header>
        <span>
          新增票类
        </span>
      </template>

      <el-form :model="form" label-width="80px" :inline="true">
        <el-form-item label="名称:">
          <el-input v-model="form.name" autocomplete="off" style="width: 230px;" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="票类:">
          <el-select v-model="value" placeholder="请选择票类" size="default" style="width: 230px"
            @visible-change="getTicketDict">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格:">
          <el-input v-model="form.name" autocomplete="off" style="width: 230px;" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="有效日期:">
          <el-date-picker v-model="value1" type="daterange" range-separator="-" start-placeholder="开始时间"
            end-placeholder="结束时间" size="default" style="width: 230px;" />
        </el-form-item>
        <el-form-item label="库存:">
          <el-input v-model="form.name" autocomplete="off" style="width: 230px;" placeholder="请输入库存" />
        </el-form-item>
      </el-form>
      <span>配置信息</span>

      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="票类图片" name="first">
          <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
            <template #tip>
              <div class="el-upload__tip">
                请上传jpg/png文件,且不超过5M的图片
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="可用时间" name="second">
          <span>可用时间:</span>
          <el-date-picker v-model="value1" type="daterange" range-separator="-" start-placeholder="开始时间"
            end-placeholder="结束时间" size="default" style="width: 230px;" />
        </el-tab-pane>
        <el-tab-pane label="详情介绍" name="third" class="flex items-center">
          <span class="mr-2">
            详情介绍:
          </span>
          <el-input v-model="value" style="width: 240px" :rows="2" type="textarea" placeholder="Please input" />
        </el-tab-pane>
        <el-tab-pane label="使用方式" name="fourth" class="flex items-center">
          <span class="mr-2">
            使用方式:
          </span>
          <el-input v-model="value" style="width: 240px" :rows="2" type="textarea" placeholder="Please input" />
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
          </el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
