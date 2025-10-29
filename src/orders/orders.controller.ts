import {Controller, Get, Post, Param, Body, Delete, HttpException, HttpStatus, Res, Query} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {Order} from "./entities/order.entity";
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

import type { Response } from 'express';

@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        ) {}

    @Post()
    async create(@Body() body: CreateOrderDto, @Res() res: Response) {
        try {
            const order = await this.ordersService.create(body);

            return  res.status(HttpStatus.OK).json({
                success: true,
                message: '订单创建成功',
                data: order,
            });
        }catch (error) {
            return res.status(HttpStatus.OK).json({
                success: false,
                message: '订单创建失败'+error.message,
                error: error.message,
            });
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Res() res: Response) {
        const deleted = await this.ordersService.deleteOrder(id);
        if (!deleted) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: '删除失败，订单不存在',
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            message: '订单已删除成功',
            orderId: id,
        });
    }

    @Post('update-status')
    async updateStatus(@Body() body, @Res() res: Response) {
        try {
            const { order_id, status, remark } = body;
            await this.ordersService.updateStatus(Number(order_id), status, remark);
            return  res.status(HttpStatus.OK).json({success: true});

        } catch (error) {
            return  res.status(HttpStatus.BAD_REQUEST).json({success: false, error: error.message});
        }
    }

    @Get(':id/items')
    async getOrderItems(@Param('id') id: number) {
        return this.ordersService.findOrderItems(+id);
    }

    @Get()
    async findAll(
        @Query('order_number') orderNumber?: string,
        @Query('status') status?: string,
        @Query('date_from') dateFrom?: string,
        @Query('date_to') dateTo?: string,
    ): Promise<string> {
        const orders = await this.ordersService.findAll({ orderNumber, status, dateFrom, dateTo });
        const products = await this.productsService.findAll();
        const users = await this.usersService.findAll();

        const filters = {
            order_number: orderNumber || '',
            status: status || '',
            date_from: dateFrom || '',
            date_to: dateTo || '',
        };

        // 生成用户下拉选项 HTML
        let usersHtml = `<option value="">-- 请选择用户 --</option>`;
        users.forEach(user => {
            usersHtml += `
              <option value="${user.id}">
                ${user.name}
              </option>`;
        });

        // 生成产品下拉选项 HTML
        let productOptionsHtml = `<option value="">-- 请选择产品 --</option>`;
        products.forEach(product => {
            productOptionsHtml += `
              <option value="${product.id}"
                      data-price="${product.price}"
                      data-currency="${product.currency}">
                ${product.name}
              </option>`;
        });

        // 构建 HTML 表格
        let html = `
    <html>
    <head>
    <meta charset="utf-8" />
      <title>訂單列表</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
      />
        <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
      <style>
 body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background: #f9f9f9;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      background: white;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #4CAF50;
      color: white;
    }
    tr:hover {
      background-color: #f1f1f1;
    }
    .btn-info {
      background-color: #17a2b8;
      color: white;
      border: none;
    }
    .btn-info:hover {
      background-color: #138496;
    }
      </style>
    </head>
    <body>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>订单列表</h2>
        <button class="btn btn-success" data-bs-target="#createOrderModal" onclick="showCreateOrderModal()">
            創建訂單
        </button>
        
    </div>
      
    <!-- 筛选表单 -->
    <form method="GET" action="/orders" class="mb-4">
      <div class="row">
        <div class="col-md-3">
          <input type="text" name="order_number" class="form-control" placeholder="订单号" value="${filters.order_number}">
        </div>
        <div class="col-md-3">        
          <select name="status" class="form-control">
            <option value="">--订单状态--</option>            
            <option value="pending" ${filters.status === 'pending' ? 'selected' : ''}>待付款</option>
            <option value="paid" ${filters.status === 'paid' ? 'selected' : ''}>已付款</option>
            <option value="shipped" ${filters.status === 'shipped' ? 'selected' : ''}>已发货</option>
          </select>
        </div>
        <div class="col-md-3">
          <input type="date" name="date_from" class="form-control" value="${filters.date_from}">
        </div>
        <div class="col-md-3">
          <input type="date" name="date_to" class="form-control" value="${filters.date_to}">
        </div>
      </div>
    
      <div class="mt-3">
        <button type="submit" class="btn btn-primary">筛选</button>
        <a href="/orders" class="btn btn-secondary">重置</a>
      </div>
    </form>
      
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>訂單號</th>
            <th>用戶名稱</th>
            <th>幣種</th>
            <th>總金額</th>
            <th>支付方式</th>
            <th>建立時間</th>
            <th>狀態</th>            
            <th>明細</th>
          </tr>
        </thead>
        <tbody>
    `;

        orders.forEach((order) => {
            html += `
        <tr>
          <td>${order.order_number}</td>
          <td>${order.user.name}</td>
          <td>${order.currency}</td>
          <td>${order.total_amount}</td>
          <td>
            ${order.payment_method === 'alipay'
                ? '支付宝'
                : order.payment_method === 'wechat'
                    ? '微信'
                    : order.payment_method === 'payPal'
                        ? 'payPal'
                            : '未知方式'}
          
          
          </td>
          <td>${order.created_at ? new Date(order.created_at).toLocaleString() : ''}</td>
          <td>
            ${order.status === 'pending'
                ? '待付款'
                : order.status === 'paid'
                    ? '已付款'
                    : order.status === 'shipped'
                        ? '已发货'
                        : order.status === 'completed'
                            ? '已完成'
                            : '未知状态'}
          </td>
          <td>
            <button class="btn btn-sm btn-info" onclick="showModal(${order.id})">查看明细</button>
            <button class="btn btn-sm btn-warning btn-update-order" data-id="${order.id}" data-status="${order.status}">修改状态</button>
            <button class="btn btn-sm btn-danger btn-delete-order" data-id="${order.id}">删除</button>
          </td>
        </tr>
      `;
        });

        html += `
        </tbody>
      </table>

      <div class="modal fade" id="createOrderModal" tabindex="-1" aria-labelledby="createOrderModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <form id="createOrderForm">
                    <div class="modal-header">
                        <h5 class="modal-title" id="createOrderModalLabel">創建新訂單</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="customer_phone" class="form-label"><span class="text-danger">*</span>用户</label>
                             <select name="user_id" class="form-select product-select" required>
                                ${usersHtml}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="customer_phone" class="form-label"><span class="text-danger">*</span>聯繫方式</label>
                            <input type="number" name="customer_phone" id="customer_phone" class="form-control" placeholder="請輸入手機號碼">
                        </div>
                        <div class="mb-3">
                            <label for="customer_address" class="form-label"><span class="text-danger">*</span>詳細收貨地址</label>
                            <input type="text" name="customer_address" id="customer_address" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="payment_method" class="form-label"><span class="text-danger">*</span>支付方式</label>
                            <select name="payment_method" id="payment_method" class="form-select" required>
                                <option value="alipay">支付宝</option>
                                <option value="wechat">微信</option>
                                <option value="paypal">paypal</option>
                            </select>
                            <input type="hidden" name="status" value="pending">
                            <input type="hidden" name="currency" value="TWD">
                        </div>
                        <hr>

                        <h5>订单明细</h5>
                        
                        <div id="order-items">
                            <div class="row mb-2 order-item">
                                <div class="col">
                                    <select name="items[0][product_id]" class="form-select product-select" required>
                                      ${productOptionsHtml}
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="number" name="items[0][price]" class="form-control product-price" placeholder="金额" readonly>
                                </div>
                                <div class="col">
                                    <input type="text" name="items[0][currency]" class="form-control product-currency" placeholder="币种" readonly>
                                </div>
                                <div class="col">
                                    <input type="text" name="items[0][quantity]" class="form-control product-quantity" placeholder="数量">
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-danger btn-remove-item">✖</button>
                                </div>
                            </div>
                        </div>
                        <button type="button" id="add-item" class="btn btn-sm btn-outline-primary">+ 添加明细</button>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" id="submitOrderBtn">创建订单</button>
                    </div>
             </form>
             </div>
        </div>
    </div>
      <div class="modal fade" id="staticModal" tabindex="-1" aria-labelledby="staticModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="staticModalLabel">订单明细</h5> <!-- 初始文字，可动态修改 -->
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button>
              </div>
              <div class="modal-body">
                <ul id="staticModalItems">
                  <!-- 商品列表可以通过 JS 动态填充 -->
                </ul>
                <p><strong>订单总额：<span id="staticModalTotal">0.00</span></strong></p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
              </div>
            </div>
          </div>
      </div>
      
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

      <script>
        async function showCreateOrderModal() {
          const orderModal = new bootstrap.Modal(document.getElementById('createOrderModal'));
          orderModal.show();
        }
      
        async function showModal(orderId) {
          // 假设你有一个接口返回订单明细
          const response = await fetch('/orders/' + orderId + '/items');
          const items = await response.json();

          // 动态修改标题
          const modalTitle = document.getElementById('staticModalLabel');
          modalTitle.textContent = '订单明细';

          // 动态填充商品列表
          const itemsContainer = document.getElementById('staticModalItems');
          itemsContainer.innerHTML = ''; // 清空之前内容
          let total = 0;
          
          let tableHtml = \`
              <table class="table table-sm table-bordered align-middle">
                <thead class="table-light">
                  <tr>
                    <th>商品名称</th>
                    <th>数量</th>
                    <th>单价</th>
                    <th>币种</th>
                    <th>小计</th>
                  </tr>
                </thead>
                <tbody>
            \`;
            
        items.forEach(item => {
          const subtotal = item.price * item.quantity;
          total += subtotal;
          tableHtml += \`
              <tr>
                <td>\${item.product.name}</td>
                <td>\${item.quantity}</td>
                <td>\${item.price}</td>
                <td>\${item.currency}</td>
                <td>\${subtotal.toFixed(2)}</td>
              </tr>
            \`;
        });    
            
          
          tableHtml += \`
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="4" class="text-end"><strong>总计：</strong></td>
                    <td><strong>\${total.toFixed(2)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            \`;

          itemsContainer.innerHTML = tableHtml;
          
          // items.forEach(item => {
          //   const subtotal = item.price * item.quantity;
          //   total += subtotal;
          //   const li = document.createElement('li');
          //   itemsContainer.appendChild(li);
          // });

          // 更新总额
          document.getElementById('staticModalTotal').textContent = total.toFixed(2);
        
          // 打开模态框
          const staticModalEl = document.getElementById('staticModal');
          const staticModal = new bootstrap.Modal(staticModalEl);
          staticModal.show();
        }
        
        // 当选择产品时，自动填充价格和币种
        document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-select')) {
          const option = e.target.selectedOptions[0];
          const row = e.target.closest('.order-item');
          row.querySelector('.product-price').value = option.getAttribute('data-price') || '';
          row.querySelector('.product-currency').value = option.getAttribute('data-currency') || '';
          row.querySelector('.product-quantity').value = 1;
        }
      });
      
        document.getElementById('add-item').addEventListener('click', function () {
        const container = document.getElementById('order-items');
        const index = container.querySelectorAll('.order-item').length;
    
        const newRow = document.createElement('div');
        newRow.classList.add('row', 'mb-2', 'order-item');
        newRow.innerHTML = \`
          <div class="col">
            <select name="items[\${index}][product_id]" class="form-select product-select" required>
              <option value="">-- 请选择产品 --</option>
              ${products.map(p => `
                <option value="${p.id}" data-price="${p.price}" data-currency="${p.currency}">
                  ${p.name}
                </option>`).join('')}
            </select>
          </div>
          <div class="col">
            <input type="number" name="items[\${index}][price]" class="form-control product-price" placeholder="金额" readonly>
          </div>
          <div class="col">
            <input type="text" name="items[\${index}][currency]" class="form-control product-currency" placeholder="币种" readonly>
          </div>
          <div class="col">
            <input type="number" name="items[\${index}][quantity]" class="form-control product-quantity" placeholder="数量" required>
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-danger btn-remove-item">✖</button>
          </div>
        \`;
        container.appendChild(newRow);
      });
        
        // 删除明细行
        document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove-item')) {
          e.target.closest('.order-item').remove();
        }
      });
        
      </script>
      
      <script>
        document.addEventListener('DOMContentLoaded', function () {
        
            // 绑定删除按钮点击事件
            document.querySelectorAll('.btn-delete-order').forEach(btn => {
            btn.addEventListener('click', function () {
        
              const orderId = this.getAttribute('data-id');
        
              Swal.fire({
                title: '确定删除该订单？',
                text: '删除后将无法恢复该订单记录！',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '是的，删除',
                cancelButtonText: '取消'
              }).then((result) => {
                if (result.isConfirmed) {
                
                    fetch(\`/orders/\${orderId}\`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(res => res.json())
                            .then(res => {
                                if (res.success) {
                                    Swal.fire('刪除成功', '订单已刪除', 'success');
                                    // 页面可选刷新或局部更新
                                    setTimeout(() => location.reload(), 800);
                                } else {
                                    Swal.fire('刪除错误', res.message || '訂單刪除失败', 'error');
                                }
                            })
                            .catch(err => Swal.fire('错误1', '请求失败，请稍后再试', 'error'));
                
                
                
                  // Swal.fire({
                  //   title: '已确认',
                  //   text: \`你点击了删除按钮，订单ID是：\${orderId}\`,
                  //   icon: 'info',
                  //   confirmButtonText: '确定'
                  // });
                }
              });
            });
          });
          
            // 绑定修改按钮点击事件
            document.querySelectorAll('.btn-update-order').forEach(btn => {
            btn.addEventListener('click', function () {
        
              const orderId = this.getAttribute('data-id');
              const orderStatus = this.getAttribute('data-status');
              
              Swal.fire({
                title: '修改订单状态',
                html: \`
                <select id="newStatus" class="swal2-input">
                    <option value="pending" \${orderStatus === 'pending' ? 'selected' : ''}>待付款</option>
                    <option value="paid" \${orderStatus === 'paid' ? 'selected' : ''}>已付款</option>
                    <option value="shipped" \${orderStatus === 'shipped' ? 'selected' : ''}>已发货</option>
                </select>
                <textarea id="remark" class="swal2-textarea" placeholder="备注（可选）"></textarea>
            \`,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                preConfirm: () => {
                    return {
                        status: document.getElementById('newStatus').value,
                        remark: document.getElementById('remark').value,
                        order_id: orderId
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const data = result.value;
                    fetch(\`/orders/update-status\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (res.success) {
                                Swal.fire('已更新', '订单状态已修改成功', 'success');
                                // 页面可选刷新或局部更新
                                setTimeout(() => location.reload(), 800);
                            } else {
                                Swal.fire('错误', res.message || '更新失败', 'error');
                            }
                        })
                        .catch(err => Swal.fire('错误', '请求失败，请稍后再试', 'error'));
                }
            });
                
              });
            });
    
            // 创建订单
            document.getElementById('submitOrderBtn').addEventListener('click', function (e) {
            let form = document.getElementById('createOrderForm');
            let formData = new FormData(form);
            let data = Object.fromEntries(formData.entries());
            
            // 处理 items
            const items = [];
              for (const key in data) {
                const match = key.match(/^items\\[(\\d+)\\]\\[(.+)\\]$/);
                if (match) {
                  const [_, i, field] = match;
                  const index = parseInt(i, 10);
                  items[index] = items[index] || {};
                  items[index][field] = data[key];
                  delete data[key];
                }
              }
              data.items = items;
            
            fetch(\`/orders\`, {
                 method: 'POST',
                 headers: {
                            'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(data)
            }).then(res => res.json())
                        .then(res => {
                            if (res.success) {
                                Swal.fire('已更新', '订单创建成功', 'success');
                                // 页面可选刷新或局部更新
                                setTimeout(() => location.reload(), 800);
                            } else {
                              
                               Swal.fire({
                                    title: '⚠️ 表单验证失败',
                                    html: res.message.join('<br>'),
                                    icon: 'warning'
                                });
                            }
                        }).catch(err => {
                              console.error(err);
                              Swal.fire('错误', '网络请求失败', 'error');
                            }
                      
                        )
    
          });
        
        });
      </script>
      
    </body>
    </html>
    `;

        return html;
    }
}
