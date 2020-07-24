<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h5 class="my-2">
          <i class="fa fa-comments" />
          التعليقات
        </h5>
      </div>
    </div>
    <div class="top-section">
      <div class="p-3 mb-3 card">
        <form>
          <!-- //@submit.preve  nt="applyFilters()" -->
          <h4 style="font-size: 17px;font-weight: bold;">
            خيارات التعليقات
          </h4>
          <hr>
          <div class="row">
            <div class="col-md-6 col-12">
              <div class="form-group">
                <label for="title" class="text-muted">ال ID الخاص بالتعليق </label>
                <div class="d-flex align-items-center">
                  <input
                    class="form-control comments-input col-8"
                    type="text"
                    placeholder="ال ID الخاص بالتعليق"
                  >
                  <button class="btn btn-primary col-2 btn-bg ml-4">
                    ذهاب
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-12">
              <div class="form-group">
                <label for="title" class="text-muted">ال ID الخاص بالخبر </label>
                <div class="d-flex align-items-center">
                  <input
                    class="form-control comments-input col-8"
                    type="text"
                    placeholder="ال ID الخاص بالخبر"
                  >
                  <button class="btn btn-primary col-2 btn-bg ml-4">
                    ذهاب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="adv-search card p-4">
      <form class="form-inline">
        <div class="form-group">
          <label for="username">اسم المستخدم</label>
          <input id="username" type="text" placeholder="مثل: Ahmed Ali" class="form-control mx-sm-3" aria-describedby="passwordHelpInline">
        </div>
        <div class="form-group">
          <label for="uid">ال ID الخاص بالمستخدم</label>
          <input id="uid" type="text" class="form-control mx-sm-3" aria-describedby="passwordHelpInline">
        </div>
        <div class="form-group">
          <label for="newsid">ال ID الخاص بالخبر</label>
          <input id="newsid" type="text" class="form-control mx-sm-3" aria-describedby="passwordHelpInline">
        </div>
        <div class="form-group mt-3">
          <label for="status"> حالة التعليق</label>
          <select id="status" name="" class="form-control mx-sm-3">
            <option value="all">
              الجميع
            </option>
          </select>
        </div>
        <div class="form-group mt-3">
          <label for="status"> اليوم</label>
          <flat-pickr
            :config="config"
            placeholder="تاريخ النشر"
            class="form-control mx-sm-3"
            name="date"
          />
        </div>
        <div class="form-group mt-3">
          <label for="status">  الفترة الزمنية</label>
          <select id="status" name="" class="form-control mx-sm-3">
            <option value="all">
              من
            </option>
          </select>
          <select id="status" name="" class="form-control mx-sm-2">
            <option value="all">
              الى
            </option>
          </select>
        </div>
        <button class="btn btn-primary col-2 btn-bg mt-3 ml-4">
          تصفية
        </button>
      </form>
    </div>
    <div ref="tableContainer" class="articles-table comments-table table-responsive">
      <table class="table table-striped" dir="rtl">
        <thead>
          <tr>
            <th>ال ID الخاص بالتعليق</th>
            <th class="text-center">
              اسم المستخدم
            </th>
            <th>تاريخ التعليق</th>
            <th>
              عنوان المقال
            </th>
            <th>
              محتوى التعليق
            </th>
            <th>
              الحالة
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">
              483642 <br> CID:3923734
            </td>
            <td class="text-center">
              Ahmed Shihry <br> ahmedshihiry@gmail.com <br>
              <button class="comments-table--action-btn">
                <i class="fa fa-times" />  حظر
              </button>
            </td>
            <td>
              16/03/2020 <br> 15:28
            </td>
            <td>
              “الداخلية الكويتيتة” تعلن القبض على وافد عربى بث فيديوهات تسئ للبلاد
            </td>
            <td>
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى
            </td>

            <td class="articles-table__status text-center" style="min-width:110px">
              <span

                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>م النشر</span>

              </span>
              <button class="comments-table--action-btn">
                <i class="fa fa-trash" />   حذف
              </button>
              <!-- <span

                class="articles-table__status--hold"
              >
                <i class="fa fa-trash" />
                <span>محذوف</span>
              </span> -->
            </td>
          </tr>
          <tr>
            <td class="text-center">
              483642 <br> CID:3923734
            </td>
            <td class="text-center">
              Ahmed Shihry <br> ahmedshihiry@gmail.com <br>
              <button class="comments-table--action-btn">
                <i class="fa fa-times" />  حظر
              </button>
            </td>
            <td>
              16/03/2020 <br> 15:28
            </td>
            <td>
              “الداخلية الكويتيتة” تعلن القبض على وافد عربى بث فيديوهات تسئ للبلاد
            </td>
            <td>
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى
            </td>

            <td class="articles-table__status text-center" style="min-width:110px">
              <span class="articles-table__status--hold">
                <i class="fa fa-trash" />
                <span>محذوف</span>
              </span>
              <button class="comments-table--action-btn">
                <i class="fa fa-undo" />   إظهار التعليق
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-center">
              483642 <br> CID:3923734
            </td>
            <td class="text-center">
              Ahmed Shihry <br> ahmedshihiry@gmail.com <br>
              <button class="comments-table--action-btn">
                <i class="fa fa-times" />  حظر
              </button>
            </td>
            <td>
              16/03/2020 <br> 15:28
            </td>
            <td>
              “الداخلية الكويتيتة” تعلن القبض على وافد عربى بث فيديوهات تسئ للبلاد
            </td>
            <td>
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى
            </td>

            <td class="articles-table__status text-center" style="min-width:110px">
              <span

                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>تم النشر</span>

              </span>
              <button class="comments-table--action-btn">
                <i class="fa fa-trash" />   حذف
              </button>
              <!-- <span

                class="articles-table__status--hold"
              >
                <i class="fa fa-trash" />
                <span>محذوف</span>
              </span> -->
            </td>
          </tr>
          <tr>
            <td class="text-center">
              483642 <br> CID:3923734
            </td>
            <td class="text-center">
              Ahmed Shihry <br> ahmedshihiry@gmail.com <br>
              <button class="comments-table--action-btn">
                <i class="fa fa-times" />  حظر
              </button>
            </td>
            <td>
              16/03/2020 <br> 15:28
            </td>
            <td>
              “الداخلية الكويتيتة” تعلن القبض على وافد عربى بث فيديوهات تسئ للبلاد
            </td>
            <td>
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى
            </td>

            <td class="articles-table__status text-center" style="min-width:110px">
              <span

                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>تم النشر</span>

              </span>
              <button class="comments-table--action-btn">
                <i class="fa fa-trash" />   حذف
              </button>
              <!-- <span

                class="articles-table__status--hold"
              >
                <i class="fa fa-trash" />
                <span>محذوف</span>
              </span> -->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- <div v-if="series.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div> -->
    </div>
    <!-- <div class="row">
      <div class="col-4">
        <span><i class="fa fa-link" /></span>
        <span>عدد السلاسل:</span>
        <span><b>{{ data.meta.total }}</b></span>
      </div>
      <div class="col-8 d-flex justify-content-end">
        <pagination
          :data="data"
          :limit="3"
          @pagination-change-page="fetchData"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      config: {
        wrap: false,
        // altFormat: 'F j, Y',
        // altInput: true,
        dateFormat: 'Y-m-d'
      }
    };
  }
};
</script>
<style>
.btn-bg{
  background-color: #3385CF;
    border-color: #3385CF;
    height: 31px;
    line-height: 23px;
}
.comments-input, .adv-search input, .adv-search select{
  height: 31px;
}
.adv-search select{
  width: 90px !important;
}
.adv-search label{
  font-size: 14px;
}
.comments-table table td, .comments-table table th{
  font-size: 14px;
}
.comments-table--action-btn{
  margin-top: 10px;
  background-color: transparent;
  color: #2D639D;
  border: 0;
  cursor: pointer;
  font-weight: bold;
}
</style>
