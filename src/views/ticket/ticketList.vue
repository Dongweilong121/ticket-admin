<script setup lang='ts'>
import { getTicketList, getDict, saveOrUpdateTicketList, getTicketByIdApi, updateIsEnableById } from '@/api/ticket';
import { ref, onMounted, reactive } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { chenFromatDate } from '@/utils/chen'
import RichEditor from '@/components/RichEditor/index.vue';


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
  const req = {
    "ticketListName": "", //票类名称
    "pageNum": currentPage.value,
    "pageSize": pageSize.value,
    "sortField": "a.create_time",
    "sortOrder": "desc"
  }

  const { code, data } = await getTicketList(req)

  if (code == 1) {
    tableData.value = data.list
    total.value = data.totalSize
  } else {
    ElMessage.error('获取票类列表失败')
  }
}

const getTicketDict = async () => {
  const { code, data } = await getDict('ticket_list_type')
  if (code == 1) {
    options.value = data.map(item => {
      return {
        label: item.dic_value,
        value: item.dic_kay
      }
    })
  } else {
    ElMessageBox.alert('获取票类字典失败')
  }
}
const validateMoney = (rule, value, callback) => {
  const strValue = String(value);

  if (!value) {
    callback(new Error('价格不能为空'))
  } else if (strValue.indexOf(".") != -1 && strValue.split('.').length > 2) {
    callback(new Error('请输入正确格式的金额')) //防止输入多个小数点
  } else if (strValue.indexOf(".") != -1 && strValue.split('.')[1].length > 2) {
    callback(new Error('请输入正确的小数位数')) //小数点后两位
  } else {
    callback();
  }
};

const dialogVisible = ref(false)

const rules = reactive({
  ticket_list_name: [
    { required: true, message: '请输入票类名称', trigger: 'blur' }
  ],
  ticket_list_type: [
    { required: true, message: '请选择票类类型', trigger: 'blur' }
  ],
  ticket_list_price: [
    { required: true, message: '请输入票类价格', trigger: 'blur' },
    { type: "string", message: '请输入数字', trigger: 'change', validator: validateMoney }
  ],
  ticket_list_repertory: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    { type: "number", message: '请输入数字', trigger: 'change' }
  ]
})


const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确定要退出编辑吗?')
    .then(() => {
      done()
      cancel()
    })
    .catch(() => {
      // catch error
    })
}

const handleDetailsChange = (val: string) => {
  console.log('详情内容改变:', val);
}

const handleUsageChange = (val: string) => {
  console.log('使用方式改变:', val);
}

const dateArray = ref([])
const dialogForm = ref({
  ticket_list_id: '',
  ticket_list_name: '',
  ticket_list_price: null,
  ticket_list_type: '',
  ticket_list_repertory: '',
  ticket_list_details: '',
  ticket_list_model: '',
  isEnable: 'Y'
})
const dialogFormRef = ref(null)

const postTicket = async () => {
  const formEl = dialogFormRef.value
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const req = {
        ticketListId: dialogForm.value.ticket_list_id == '' ? '' : dialogForm.value.ticket_list_id,
        ticketListName: dialogForm.value.ticket_list_name,
        ticketLisType: dialogForm.value.ticket_list_type,
        ticketListPrice: dialogForm.value.ticket_list_price,
        ticketListRepertory: dialogForm.value.ticket_list_repertory,
        saleableRangeStartDate: chenFromatDate(dateArray.value[0]),
        saleableRangeEndDate: chenFromatDate(dateArray.value[1]),
        isEnable: dialogForm.value.isEnable,
        ticketListDetails: dialogForm.value.ticket_list_details,
        ticketListModel: dialogForm.value.ticket_list_model,
      }
      console.log(req);

      if (!dialogForm.value.ticket_list_id) {
        if (!uploadImgval.value) {
          return ElMessage.error('请上传图片')
        }
      }
      if (req.ticketListDetails == '') {
        return ElMessage.error('请输入详情介绍')
      }
      if (req.ticketListModel == '') {
        return ElMessage.error('请输入使用方式')
      }
      const formdata = new FormData()
      formdata.append('jsonStr', JSON.stringify(req))
      formdata.append('file', uploadImgval.value)
      saveOrUpdateTicketList(formdata)
        .then(res => {
          if (res.code == 1) {
            ElMessage.success('提交成功')
            getTicket()
          } else {
            ElMessage.error('提交失败,请重试')
          }
        })
        .catch(err => {
          console.log(err);
          ElMessage.error(err)
        })
        .finally(() => {
          dialogForm.value = {
            ticket_list_id: '',
            ticket_list_name: '',
            ticket_list_price: null,
            ticket_list_type: '',
            ticket_list_repertory: '',
            ticket_list_details: '',
            ticket_list_model: '',
            isEnable: 'Y'
          }
          imageUrl.value = ''
          dateArray.value = []
          dialogVisible.value = false
        })
    } else {
      console.log('error submit!', fields);
      return false;
    }
  });

}

const imageUrl = ref('')
const uploadImgval = ref(null)
const uploadImg = (file) => {
  if (beforeAvatarUpload(file.raw)) {
    imageUrl.value = URL.createObjectURL(file.raw)
    uploadImgval.value = file.raw
  }
}
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('照片格式只能是 JPG/PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('照片大小不能超过 5MB!')
    return false
  }
  return true
}

// 根据id获取详情
const getTicketById = async (id: string) => {
  const { code, data } = await getTicketByIdApi(id)
  if (code == 1) {
    dialogVisible.value = true
    dialogForm.value = {
      isEnable: data.is_enable,
      ticket_list_id: data.ticket_list_id,
      ticket_list_name: data.ticket_list_name,
      ticket_list_price: data.ticket_list_price,
      ticket_list_type: data.ticket_list_type,
      ticket_list_repertory: data.ticket_list_repertory as string,
      ticket_list_details: data.ticket_list_details,
      ticket_list_model: data.ticket_list_model,
    }
    dateArray.value = [data.saleable_range_start_date, data.saleable_range_end_date]
    imageUrl.value = data.storage_file_path
    console.log(dialogForm.value);

  } else {
    ElMessage.error('获取票类详情失败')
  }
}

const changeEnable = (e) => {
  console.log(e);
  ElMessageBox.confirm(
    '确定要更改状态吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const res = await updateIsEnableById(e.ticket_list_id, e.is_enable)
    if (res.code == 1) {
      ElMessage.success('更改成功')
    } else {
      ElMessage.error('更改失败')
    }
  })
    .catch(() => {
      e.is_enable = e.is_enable == 'Y' ? 'N' : 'Y'
    })

}









onMounted(() => {
  getTicket()
  getTicketDict()
})

const cancel = () => {
  dialogVisible.value = false
  dialogForm.value = {
    isEnable: '',
    ticket_list_id: '',
    ticket_list_name: '',
    ticket_list_price: null,
    ticket_list_type: '',
    ticket_list_repertory: '',
    ticket_list_details: '',
    ticket_list_model: ''
  }
  imageUrl.value = ''
  dateArray.value = []
  uploadImgval.value = null
}

const newTicket = () => {
  dialogVisible.value = true
  dialogForm.value = {
    isEnable: 'Y',
    ticket_list_id: '',
    ticket_list_name: '',
    ticket_list_price: null,
    ticket_list_type: '',
    ticket_list_repertory: '',
    ticket_list_details: '',
    ticket_list_model: ''
  }
  imageUrl.value = ''
  dateArray.value = []
  uploadImgval.value = null
}
const activeName = ref('first')

const handleClick = (tab: any, event: Event) => {
  console.log(tab, event)
}

const options = ref([])




</script>

<template>
  <div>
    <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:10px; height: 100%;">

      <div>
        <el-button type="primary" @click="newTicket">
          <IconifyIconOnline icon="ep:plus" />新增票类
        </el-button>
      </div>

      <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
        <el-table-column fixed prop="ticket_list_name" label="名称" align="center" />
        <el-table-column prop="ticket_list_type_str" label="票类" align="center">
          <template #default="{ row }">
            <el-tag :type="row.ticket_list_type_str === '成人票' ? 'primary' : 'success'"> {{ row.ticket_list_type_str
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ticket_list_price" label="价格(元)" align="center" />
        <el-table-column prop="saleable_range_end_date" label="有效日期" align="center" />
        <el-table-column prop="is_enable" label="状态" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.is_enable" active-value="Y" inactive-value="N" @change="changeEnable(row)"
              active-text="已启用" inactive-text="已停用" inline-prompt>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="getTicketById(row.ticket_list_id)">
              编辑
            </el-button>
            <!-- <el-button link type="primary">删除</el-button> -->
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
        <span class="text-lg font-bold">
          新增票类
        </span>
      </template>

      <el-form :model="dialogForm" label-width="100px" :inline="true" :rules="rules" ref="dialogFormRef">
        <el-form-item label="名称:" prop="ticket_list_name">
          <el-input v-model="dialogForm.ticket_list_name" autocomplete="off" style="width: 230px;"
            placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="票类:" prop="ticket_list_type">
          <el-select v-model="dialogForm.ticket_list_type" placeholder="请选择票类" size="default" style="width: 230px"
            @visible-change="getTicketDict">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格:" prop="ticket_list_price">
          <el-input v-model="dialogForm.ticket_list_price" autocomplete="off" style="width: 230px;"
            placeholder="请输入价格(单位：元)" :min="0" precision="2" oninput="value=value.replace(/[^0-9.]/g,'')" />
        </el-form-item>
        <el-form-item label="有效日期:" prop="dateArray">
          <el-date-picker v-model="dateArray" type="daterange" range-separator="-" start-placeholder="开始时间"
            end-placeholder="结束时间" size="default" style="width: 230px;" :rules="[
              [
                { required: true, message: '请选择有效日期', trigger: 'blur' }
              ],
            ]" />
        </el-form-item>
        <el-form-item label="库存:" prop="ticket_list_repertory">
          <el-input v-model.number="dialogForm.ticket_list_repertory" autocomplete="off" style="width: 230px;"
            placeholder="请输入库存" />
        </el-form-item>
      </el-form>

      <div class="mb-3">
        <span class="text-lg text-black font-bold">配置信息</span>
      </div>
      <div class="m-3 ml-4">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="票类图片" name="first">
            <el-upload class="avatar-uploader" action="#" :show-file-list="false" :limit="1" :auto-upload="false"
              :before-upload="beforeAvatarUpload" :on-change="uploadImg">
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
          <!-- <el-tab-pane label="可用时间" name="second">
            <span class="mr-2">
              可用时间:
            </span>
            <el-date-picker v-model="dateArray" type="daterange" range-separator="-" start-placeholder="开始时间"
              end-placeholder="结束时间" size="default" style="width: 230px;" />
          </el-tab-pane> -->
          <el-tab-pane label="详情介绍" name="third" class="flex items-center">
            <span class="mr-2">详情介绍:</span>
            <RichEditor :key="'details-' + dialogForm.ticket_list_id" v-model="dialogForm.ticket_list_details"
              @change="handleDetailsChange" :placeholderStr="'请输入详情介绍'" />
          </el-tab-pane>
          <el-tab-pane label="使用方式" name="fourth" class="flex items-center">
            <span class="mr-2">使用方式:</span>
            <RichEditor :key="'usage-' + dialogForm.ticket_list_id" v-model="dialogForm.ticket_list_model"
              @change="handleUsageChange" :placeholderStr="'请输入使用方式'" />
          </el-tab-pane>
        </el-tabs>
      </div>


      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="postTicket()">
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
